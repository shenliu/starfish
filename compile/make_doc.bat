set js_doc_path="J:/Html/jsdoc_toolkit-2.4.0"
java -jar %js_doc_path%/jsrun.jar %js_doc_path%/app/run.js -a -t=%js_doc_path%/templates/jsdoc -e=utf-8 -d=../doc ../src/*.js
