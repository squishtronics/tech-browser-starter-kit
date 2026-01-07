# Tech Browser Starter Kit

## Quick start
Install dependencies
```bash
npm install
```  
 
Build and start the server
```bash
npm start
```

Open http://localhost:4200 in a browser and a small tech tree can be seen.

## Example data
This example contains a subset of the Alpha Centauri tech tree in [data.json](./src/app/data/data.json).

Technologies
* Information Networks
* Applied Physics
* Industrial Base
* Nonlinear Mathematics
* High Energy Chemistry

Object types
* Technology
* Facility
* Weapon
* Ability
* Armor

## UI Features
The starter demo contains the following UI features.  
Feel free to alter these behaviors or add your own.

### Tech block selection
Click a tech block to focus on that tech.  
Its requirements and dependencies will also be highlighted along with the lines.

### Tech header selection
Click on a tech header to both select the tech block and show a popup with more details about the tech.  
The popup appears on a side where there is space available.  
The popup is stable, and may contain clickable links.   
Click outside the popup to close it.

### Object selection
Clicking on an object unlocked by a tech will select that object and its tech.  
The line of the object will be highlighted.  
A popup appears containing details of the object.

### Navigation
Clicking on a tech link will scroll the view towards that tech block.

### Deep-linking
URLs may contain a tech id, on opening that URL the tech id in question will be selected and scrolled into view.

### Filter on object type
Object types may be filtered, objects of these types will be invisible but their space will remain reserved.  
This may help in highlighting specific object types or creating a less cluttered view.

## Adding new data
New data can be added to [data.json](./src/app/data/data.json).

The JSON must conform to the types declared in [types.ts](./src/app/data/types.ts). This is also where new object types can be added.

After adding a new type, also visit the following places:
* [data-service.factory.ts](./src/app/data/data-service.factory.ts) to add the new type to the data service
* [object-tooltip.component.html](./src/app/details/object-tooltip.component.html) to specify how the details of this type will be displayed in a popup 
* [filter.service.ts](./src/app/filters/filters.service.ts) to add the new type to the filter options