## Docker map
In deze map staan de nodige bestanden en alle submappen die gebruikt worden om de site in een docker container te runnen.

## Submappen
 - [api] (#api)
 - [db] (#db)
 - [vue] (#vue)

 ## api 
In de api map staat alles in verband met de API's die we gemaakt hebben.

Als je doorklikt naar de map src vind je nog een submap "controllers", hierin staan de JavaScript bestanden met de daadwerkelijke API's.
In de map src zie je ook nog "routes" waarin alle API routes staan. De API's kunnen getest worden met Swagger, daarvoor zijn ook alle 'comments' in het bestand.

## db
In de db map staat alles voor de database en in de submap 'init' vind je ook het restore.sql bestand.

## vue
In deze map staat alles voor de frontend, met wederom submappen. 

In de submap public staat de foto van ons logo die we gebruiken doorheen de stie en ook het VIVES logo die gebruikt wordt als het icoon voor de website.

Onder src vind je het main.js bestand waarin we alle routes naar de verschillende vue componenten initialiseren. De vue componenten zelf vind je hier in de submap 'components'. In de andere submap 'assets' worden alle kaarten opgeslaan alsook de andere afbeeldingen die worden gebruikt, zoals de foto voor de starterpack en daily reward.