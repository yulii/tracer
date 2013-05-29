# tracer

Event Tracking Framework for Google Analytics.

## Usage
Load `tracer.js` file.
```html
<script src="/lib/tracer.js" type="text/javascript"></script>
```

### Customized Labels
Use `data-trace-label` attribute.
```html
<a href="xxx" data-trace-label="customized!">click</a>
```


## Data & Reports
### Event Category
`Browser` `Version` / `OS`
### Event Action
`click` => `a`, `button`, `label`, `img`
`focus` => `input`, `textarea`, `select`
`change` => `input`, `textarea`, `select`
`scroll`
### Event Label
`this.dataset.traceLabel` or DOM summary.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


## LICENSE
(The MIT License)

Copyright © 2013 yulii. See LICENSE.txt for further details.
