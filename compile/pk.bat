cd..
cd dist
if not exist pk md pk
cd %~dp0

rem starfish core web
Packer -o ../dist/pk/starfish_all.js -m packer ../dist/gg/starfish_all.js

rem starfish
Packer -o ../dist/pk/starfish_only.js -m packer ../dist/gg/starfish_only.js

rem starfish core
Packer -o ../dist/pk/starfish_core.js -m packer ../dist/gg/starfish_core.js

rem starfish web
Packer -o ../dist/pk/starfish_web.js -m packer ../dist/gg/starfish_web.js

