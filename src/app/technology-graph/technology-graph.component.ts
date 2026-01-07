import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  TechnologyContainer,
  TechnologyGraph,
  TechnologyRelation,
} from './technology-graph';
import { ElkEdgeWithData, ElkNodeWithData, ElkRoot } from './elk-types';
import ElkConstructor, { ElkEdgeSection, LayoutOptions } from 'elkjs';
import { TechnologyNodeComponent } from './node/technology-node.component';
import { GameObject, TechnologyId } from '../data';
import { Selection, SelectionService } from './selection.service';
import { AsyncPipe } from '@angular/common';
import { FiltersService, filterTypes } from '../filters/filters.service';
import { filter, map, Subscription } from 'rxjs';
import { NavigationService } from './navigation.service';
import { ActivatedRoute, UrlSegment } from '@angular/router';

const nodeWidth = 430;
const nodeHeaderHeight = 42;
const nodeRowHeight = 20;
const borderThickness = 2;

function calculateHeight(container: TechnologyContainer): number {
  return (
    nodeHeaderHeight +
    Math.max(container.results.length, 1) * nodeRowHeight +
    borderThickness * 2 +
    4
  );
}

@Component({
  standalone: true,
  templateUrl: './technology-graph.component.html',
  styleUrl: './technology-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sqt-technology-graph',
  imports: [TechnologyNodeComponent, AsyncPipe],
})
export class TechnologyGraphComponent implements OnDestroy {
  private readonly graph = inject(TechnologyGraph);
  private readonly selection = inject(SelectionService);
  private readonly navigation = inject(NavigationService);
  private readonly filters = inject(FiltersService);

  selected$ = this.selection.selected$;
  highlighted$ = this.selection.highlighted$;
  hasActiveFilter$ = this.filters.visibleTypes$.pipe(
    map((set) => set.size < filterTypes.length)
  );

  nodes: ElkNodeWithData<TechnologyContainer>[];
  edges: ElkEdgeWithData<TechnologyRelation>[];
  graphWidth: number;
  graphHeight: number;

  subscriptions = new Subscription();

  @ViewChild('svg', { static: false })
  svg: ElementRef<SVGElement>;

  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    const nodes = this.graph.getTechnologies().map(
      (container) =>
        ({
          id: container.technology.id,
          data: container,
          layoutOptions: {
            'elk.nodeSize.minimum': `${nodeWidth}, ${calculateHeight(
              container
            )}`,
            'elk.layered.layering.layerConstraint':
              container.technology.id === TechnologyId.Root ? 'FIRST' : 'NONE',
          },
        } satisfies ElkNodeWithData<TechnologyContainer>)
    );
    const edges = this.graph.getRelations().map((relation) => ({
      id: `${relation.required}/${relation.enabled}`,
      sources: [relation.required],
      targets: [relation.enabled],
      data: relation,
    }));

    const changeDetector = inject(ChangeDetectorRef);
    const root: ElkRoot<TechnologyContainer, TechnologyRelation> = {
      id: 'graph',
      children: nodes,
      edges: edges,
    };
    const elk = new ElkConstructor({ defaultLayoutOptions });
    elk.layout(root).then(() => {
      this.nodes = nodes;
      this.edges = edges;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.graphWidth = root.width!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.graphHeight = root.height!;

      changeDetector.markForCheck();

      this.subscriptions.add(
        this.navigation.target.subscribe((target) => {
          if (target === null) {
            return;
          }
          setTimeout(() => {
            const id = `tech-node-${target}`;
            const techNode = document.getElementById(id);
            if (techNode === null) {
              console.log('not found', id);
            } else {
              techNode.scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior: 'smooth',
              });
            }
          });
        })
      );

      this.subscriptions.add(
        this.activatedRoute.url
          .pipe(
            map((segments) => parseSegments(segments, this.graph)),
            filter((target) => target !== null)
          )
          .subscribe((target) => {
            if (!this.selection.isSelected(target.tech, target.object)) {
              this.selection.select(target.tech, target.object);
              this.navigation.navigate(target.tech);
            }
          })
      );
    });
  }

  getPoints(section: ElkEdgeSection): number[] {
    return [
      section.startPoint.x,
      section.startPoint.y,
      ...(section.bendPoints ?? []).flatMap((point) => [point.x, point.y]),
      section.endPoint.x,
      section.endPoint.y,
    ];
  }

  deselect(): void {
    this.selection.deselect();
    this.navigation.clear();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

const defaultLayoutOptions: LayoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.layered.layering.strategy': 'LONGEST_PATH_SOURCE', // how to assign nodes to a layer
  'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS', // how to place nodes within their assigned layer, subjectively the best strategy for small and large graphs
  'elk.edgeRouting': 'ORTHOGONAL', // SPLINES and POLYLINE require more space

  'elk.spacing.edgeNode': '12', // space between edge and node within a layer (horizontal spacing)
  'elk.spacing.edgeEdge': '12', // space between edge and edge within a layer (horizontal spacing)
  'elk.spacing.nodeNode': '24', // space between node and node within a layer (horizontal spacing)
  'elk.spacing.portPort': '12', // space between ports on a single node's edge

  'elk.layered.spacing.edgeEdgeBetweenLayers': '12', // space between edges in between 2 layers (vertical spacing)
  'elk.layered.spacing.nodeNodeBetweenLayers': '12', // space between nodes in between 2 layers (vertical spacing)
  'elk.layered.spacing.edgeNodeBetweenLayers': '12', // space between edge and node in between 2 layers (vertical spacing)

  'elk.nodeSize.constraints': 'MINIMUM_SIZE',
};

function parseSegments(
  segments: UrlSegment[],
  graph: TechnologyGraph
): Selection | null {
  if (segments.length < 1) {
    return null;
  }
  const techId = segments[0].path as TechnologyId;
  if (segments.length === 1) {
    return { tech: techId, object: undefined };
  }
  if (segments.length === 3) {
    const objectType = segments[1].path;
    const objectName = segments[2].path;
    const technology = graph.getTechnology(techId);
    const object = resolveObject(technology, objectType, objectName);
    return { tech: techId, object };
  } else {
    return null;
  }
}

function resolveObject(
  container: TechnologyContainer,
  objectType: string,
  objectName: string
): GameObject | undefined {
  for (const result of container.results) {
    if (result.object.type === objectType && result.name === objectName) {
      return result.object;
    }
  }
  return undefined;
}
