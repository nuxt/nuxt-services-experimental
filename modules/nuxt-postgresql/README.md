
# When installing postgresq through Homebrew

You'll have to uninstall Node and reinstall it afterwards if you get this error:

> `dyld: Library not loaded: /usr/local/opt/icu4c/lib/libicui18n.60.dylib`

```sh
brew uninstall --ignore-dependencies node icu4c
brew install node
```

See https://gist.github.com/berkedel/d1fc6d13651c16002f64653096d1fded
