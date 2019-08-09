var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create(
{
    start: function() {
        console.log('Xapo Bitcoin price module started...');
    },

    getPrice: function(currency) {
        var self = this;
        var price = {}; var priceBuy = 0.00; var priceSell = 0.00;
        currency = currency.toUpperCase();
        var cBTC = currency + 'BTC';
        var BTCc = 'BTC' + currency;

        var urlBuy = 'https://api.xapo.com/v3/quotes/' + cBTC;
        var urlSell = 'https://api.xapo.com/v3/quotes/' + BTCc;

        // Buy Price
        request({ url: urlBuy, method: 'GET' }, function(error, response, body)
        {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                price.buy = result.fx_etoe[cBTC].source_amt.toFixed(2);
            }
        });

        // Sell Price
        request({ url: urlSell, method: 'GET' }, function(error, response, body)
        {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                price.sell = result.fx_etoe[BTCc].rate.toFixed(2);
            }
        });

        self.sendSocketNotification('PRICE_RESULT', JSON.stringify(price));
    },

    socketNotificationReceived: function(notification, payload)
    {
        if (notification === 'GET_PRICE') {
            this.getPrice(payload);
        }
    }
});
