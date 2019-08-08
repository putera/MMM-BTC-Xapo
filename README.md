# MMM-BTC-Xapo
A MagicMirror² Module for retrieve Xapo Bitcoin latest price

## Preview
![preview](preview.png)

## Installation
1. Navigate into your MagicMirror's `modules` folder
2. Execute `git clone https://github.com/putera/MMM-BTC-Xapo.git`

## Using the module
To use this module, add it to the modules array in the `config/config.js` file:

```javascript
modules: [
	{
		module: 'MMM-BTC-Xapo',
        position: 'top_right',
        config: {
            // See 'Configuration options' for more information.
            currency: 'MYR',
            refreshTime: 1,		// update interval price in minutes
            language: 'ms-my'
        }
    }
]
```

## Configuration Options
The following properties can be configured:

| **Option** | **Description** |
| --- | --- |
| `currency` | Your currency exchange code |
| `refreshTime` | Refresh interval time to get the price from Xapo |
| `language` | Language you are using |
