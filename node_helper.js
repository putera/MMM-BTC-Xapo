/*

    Xapo Bitcoin Price
    ====================================

    Developer : Zulkifli Mohamed (putera)
    E-mail : mr.putera@gmail.com

*/

var NodeHelper = require('node_helper');
var request = require('request');
var async = require('async');

module.exports = NodeHelper.create(
{
    start: function() {
        console.log('Xapo Bitcoin price module started...');
    },

    getPrice: function(currency) {
        var self = this;
        var priceBuy = 0.00; var priceSell = 0.00;
        currency = currency.toUpperCase();
        var cBTC = currency + 'BTC';
        var BTCc = 'BTC' + currency;

        var urlBuy = 'https://api.xapo.com/v3/quotes/' + cBTC;
        var urlSell = 'https://api.xapo.com/v3/quotes/' + BTCc;

        async.parallel({
            buy: function(callback) {
                request({ url: urlBuy, method: 'GET' }, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        callback(error, body);
                    }
                });
            },
            sell: function(callback) {
                request({ url: urlSell, method: 'GET' }, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        callback(error, body);
                    }
                });
            }
    	},
        function(error, result) {
            if (error) {
                console.log('[MMM-BTC-XAPO] ' + error);
            }

            var rBuy = JSON.parse(result.buy), rSell = JSON.parse(result.sell);

            if (rBuy) {
                priceBuy = rBuy.fx_etoe[cBTC].source_amt.toFixed(2);
            }
            if (rSell) {
                priceSell = rSell.fx_etoe[BTCc].rate.toFixed(2);
            }

            var price = {buy: priceBuy, sell: priceSell};
            self.sendSocketNotification('PRICE_RESULT', price);
        });
    },

    socketNotificationReceived: function(notification, payload)
    {
        if (notification === 'GET_PRICE') {
            this.getPrice(payload);
        }
    }
});
