/*

    Xapo Bitcoin Price
    ====================================

    Developer : Zulkifli Mohamed (putera)
    E-mail : mr.putera@gmail.com

*/

'use strict';

Module.register("MMM-BTC-Xapo",
{
    result: {},
    defaults:
    {
        currency: 'MYR',
        refreshTime: 5,
        language: "ms-my",
        animationSpeed: 2500
    },

    getStyles: function() {
        return [this.file('css/MMM-BTC-Xapo.css')];
    },

    getTranslations: function() {
        return {
            "ms-my": "translations/ms-my.json",
            "en": "translations/en.json"
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
        var data = this.result;
        var currency = this.config.currency;
        var lastPriceBuy = data.buy;
        var lastPriceSell = data.sell;

        var w = document.createElement("div");

        if (lastPriceBuy && lastPriceSell)
        {
            if (typeof lastPriceBuy != "undefined") {
                lastPriceBuy = currency + ' ' + lastPriceBuy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                lastPriceBuy = '-';
            }

            if (typeof lastPriceSell != "undefined") {
                lastPriceSell = currency + ' ' + lastPriceSell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                lastPriceSell = '-';
            }

            // Title
            var elt = document.createElement('div');
            elt.className = 'normal dimmed';
            elt.innerHTML = this.translate("XAPO_TITLE");

            // Buy
            var elbuy = document.createElement('div');
            elbuy.style.width = '50%';
            elbuy.style.float = 'left';
            var elb = document.createElement('div');
            elb.className = 'small dimmed';
            elb.innerHTML = this.translate("BUY") + ':';
            var elbp = document.createElement('div');
            elbp.className = 'medium bright';
            elbp.innerHTML = lastPriceBuy;
            elbuy.appendChild(elb);
            elbuy.appendChild(elbp);

            // Sell
            var elsell = document.createElement('div');
            elsell.style.width = '50%';
            elsell.style.float = 'right';
            var els = document.createElement('div');
            els.className = 'small dimmed buy-title';
            els.innerHTML = this.translate("SELL") + ':';
            var elsp = document.createElement('div');
            elsp.className = 'medium bright';
            elsp.innerHTML = lastPriceSell;
            elsell.appendChild(els);
            elsell.appendChild(elsp);

            w.appendChild(elt);
            w.appendChild(elbuy);
            w.appendChild(elsell);
        }
        else
        {
            var el = document.createElement("div");
            el.className = 'small dimmed';
            el.innerHTML = this.translate("LOADING");
            w.appendChild(el);
        }

        return w;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "PRICE_RESULT") {
            var self = this;
            this.result = payload;
            this.updateDom(self.config.animationSpeed);
        }
    },
});
