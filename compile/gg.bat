rem --compilation_level ADVANCED_OPTIMIZATIONS

cd..
cd dist
if not exist gg md gg
cd %~dp0

rem starfish core web
java -classpath ./c.jar com.google.javascript.jscomp.CompilerRunner --js ../dist/starfish_all.js --js_output_file ../dist/gg/starfish_all.js

rem starfish
java -classpath ./c.jar com.google.javascript.jscomp.CompilerRunner --js ../dist/starfish_only.js --js_output_file ../dist/gg/starfish_only.js

rem starfish core
java -classpath ./c.jar com.google.javascript.jscomp.CompilerRunner --js ../dist/starfish_core.js --js_output_file ../dist/gg/starfish_core.js

rem starfish web
java -classpath ./c.jar com.google.javascript.jscomp.CompilerRunner --js ../dist/starfish_web.js --js_output_file ../dist/gg/starfish_web.js

