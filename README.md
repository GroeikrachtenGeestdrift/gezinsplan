# Gezinsplan

Webapp voor training, eten en boodschappen van ons gezin. Installeerbaar op de telefoon via "Zet op beginscherm".

- `index.html` – de app
- `config.js` – koppeling met de Supabase-database
- `schema.sql` – database-opzet (eenmalig in Supabase uitvoeren)
- `media/` – animaties per oefening (zie `media/README.md`)
- `sw.js` – offline werken; verhoog `VERSIE` bij elke nieuwe release

Zonder ingevulde `config.js` draait de app in testmodus en bewaart hij alles op het toestel zelf.
