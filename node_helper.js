var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create(
{
    start: function() {
        console.log('Xapo Bitcoin price module started...');
    },

    getPrice: function(currency) {
        var self = this;
        var price = [];
        currency = currency.toUpperCase();

        var urlBuy = 'https://api.xapo.com/v3/quotes/' + currency + 'BTC';
        var urlSell = 'https://api.xapo.com/v3/quotes/BTC' + currency;

        // Buy Price
        request({ url: urlBuy, method: 'GET' }, function(error, response, body)
        {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                price.push(result.fx_etoe[0].source_amt.toFixed(2));
            } else {
                price.push("0.00");
            }
        });

        // Sell Price
        request({ url: urlSell, method: 'GET' }, function(error, response, body)
        {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                price.push(result.fx_etoe[0].rate.toFixed(2));
            } else {
                price.push("0.00");
            }
        });

        self.sendSocketNotification('PRICE', price);
    },

    socketNotificationReceived: function(notification, payload)
    {
        if (notification === 'GET_PRICE') {
            this.getPrice(payload);
        }
    }
});
