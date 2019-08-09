/*

    Xapo Bitcoin Price
    ====================================

    Developer : Zulkifli Mohamed
    E-mail : mr.putera@gmail.com

*/

'use strict';

Module.register("MMM-BTC-Xapo",
{
    result: {},
    defaults:
    {
        currency: 'MYR',
        refreshTime: 1,
        language: "ms-my"
    },

    getStyles: function() {
        return [this.file('css/MMM-BTC-Xapo.css')];
    },

    getTranslations: function() {
        return {
            "ms-my": "translations/ms-my.json"
        };
    },

    start: function() {
        this.getPrice();
        this.scheduleUpdate();
    },

    getPrice: function() {
        this.sendSocketNotification('GET_PRICE', this.config.currency.toUpperCase());
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.refreshTime * 60 * 1000;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        setInterval(function() {
            self.getPrice();
        }, nextLoad);
    },

    getDom: function() {
        var wrapper = document.createElement("xapo-price");
        wrapper.className = 'medium bright';
        wrapper.className = 'xapo-price';

        var data = JSON.parse(this.result);
        var currency = this.config.currency;      
        var lastPriceBuy = data.buy;
        var lastPriceSell = data.sell;

        if (data)
        {
            var pe = document.createElement("span");
            pe.innerHTML = self.translate("SELL") + ' : ' + currency + ' ' + lastPriceSell + ' &nbsp; ' + self.translate("BUY") + ' : ' + currency + ' ' + lastPriceBuy;
            wrapper.appendChild(pe);
        }
        else
        {
            var el = document.createElement("span");
            el.className = 'small dimmed';
            el.innerHTML = self.translate("ERROR_DATA_LOAD");
            wrapper.appendChild(el);
        }
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "PRICE_RESULT") {
            var self = this;
            this.result = payload;
            this.updateDom(self.config.fadeSpeed);
        }
    },
});
