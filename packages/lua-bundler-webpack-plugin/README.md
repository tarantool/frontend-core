#lua-bundler

##Custom options
bundleName - name of bundle<br/>
namespace - ...<br/>
entryRegExp - regExp for file names<br/>
<br/><br/>
Example: 
```
plugins: [
....
new LuaBundlePlugin({bundleName: 'customBundleName.lua', namespace: 'cluster', entryRegExp: /main.+js$/})
]
```

##Defaults

bundleName = 'bundle.lua'<br/>
namespace = ''<br/>
entryRegExp: /main.+js$/<br/>

##Debug

```
DEBUG='lua-bundler' npm run build
```
