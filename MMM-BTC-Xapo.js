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

        var data = this.result;
        var currency = this.config.currency;      
        var lastPriceBuy = data[0];
        var lastPriceSell = data[1];

        if (data)
        {
            var priceElement = document.createElement("span");
            priceElement.innerHTML = self.translate("SELL") + ' : ' + currency + ' ' + lastPriceSell + ' &nbsp; ' + self.translate("BUY") + ' : ' + currency + ' ' + lastPriceBuy;
            wrapper.appendChild(priceElement);
        }
        else
        {
            wrapper.appendChild(self.translate("ERROR_DATA_LOAD"));
        }
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "PRICE") {
            var self = this;
            this.result = payload;
            this.updateDom(self.config.fadeSpeed);
        }
    },
});
