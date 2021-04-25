1. 将package-lock.json拷贝到package-lock.json-perfect

2. 删掉package-lock.json-perfect中本地引用内容(参考package.json中的file://引用内容)，格式例如:
    "jsview-dom": {
      "version": "file:jsview/dom/bin/jsview-dom-package.tgz",
      "integrity": "sha512-+xsYiIuqRp80La0pxMVjD6WXELnx/Y7UPOFT23bp1GSX57BvKyNxn2+JpX4J96ygzPTcZjLtbSJpQ4LxUEQDuQ=="
    },
    "jsview-react-widget": {
      "version": "file:jsview/utils/JsViewEngineWidget/bin/jsview-react-widget-package.tgz",
      "integrity": "sha512-bKuTSL1vJIT91yHIzXKudGdnOLPxFqNgYYqKWmHnSEtqB9ETlh4tTl4ufMomvP86cB5qw31gSOLp4HbzNXcpjA=="
    },
