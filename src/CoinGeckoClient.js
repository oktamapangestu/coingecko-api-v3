"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CoinGeckoClient = void 0;
var https_1 = require("https");
var Enum_ts_1 = require("./Enum.ts");
/**
 * The wrap client to access all api on coin gecko
 */
var CoinGeckoClient = /** @class */ (function () {
    /**
     * Constructor
     * @param options the options passed for client library, at the moment only timeout are support
     */
    function CoinGeckoClient(options) {
        this.apiV3Url = 'https://api.coingecko.com/api/v3';
        this.options = {
            timeout: 30000,
            autoRetry: true
        };
        this.options = __assign(__assign({}, this.options), options);
    }
    CoinGeckoClient.prototype.withPathParams = function (path, replacements) {
        if (replacements === void 0) { replacements = {}; }
        var pathStr = path;
        Object.entries(replacements).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            pathStr = pathStr.replace("{" + key + "}", value);
        });
        return pathStr;
    };
    /**
     * Make HTTP request to the given endpoint
     * @param url the full https URL
     * @returns json content
     */
    CoinGeckoClient.prototype.httpGet = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var options, parseJson;
            var _this = this;
            return __generator(this, function (_a) {
                options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: this.options.timeout
                };
                parseJson = function (input) {
                    try {
                        return JSON.parse(input);
                    }
                    catch (err) {
                        return input;
                    }
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var req = https_1["default"].request(url, options, function (res) {
                            if (res.statusCode && res.statusCode === 429) {
                                resolve({
                                    statusCode: res.statusCode,
                                    data: {
                                        error: 'HTTP 429 - Too many request'
                                    },
                                    headers: res.headers
                                });
                                // reject(new Error(`HTTP status code ${res.statusCode}`));
                            }
                            var body = [];
                            res.on('data', function (chunk) { return body.push(chunk); });
                            res.on('end', function () {
                                var resString = Buffer.concat(body).toString();
                                resolve({
                                    statusCode: res.statusCode,
                                    data: parseJson(resString),
                                    headers: res.headers
                                });
                            });
                        });
                        req.on('error', function (err) {
                            reject(err);
                        });
                        req.on('timeout', function () {
                            req.destroy();
                            reject(new Error("HTTP Request timeout after " + _this.options.timeout));
                        });
                        req.end();
                    })];
            });
        });
    };
    /**
     * Generic function to make request use in internal function
     * @param action
     * @param params
     * @returns
     */
    CoinGeckoClient.prototype.makeRequest = function (action, params) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var qs, requestUrl, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = Object.entries(params).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return key + "=" + value;
                        }).join('&');
                        requestUrl = this.apiV3Url + this.withPathParams(action, params) + "?" + qs;
                        return [4 /*yield*/, this.httpGet(requestUrl)];
                    case 1:
                        res = _a.sent();
                        if (!(res.statusCode === 429 && this.options.autoRetry)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 2000); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.makeRequest(action, params)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/, res.data];
                }
            });
        });
    };
    /**
     * Check API server status
     * @returns {PingResponse}
     */
    CoinGeckoClient.prototype.ping = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.PING)];
            });
        });
    };
    CoinGeckoClient.prototype.trending = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.SEARCH_TRENDING)];
            });
        });
    };
    /**
     * List all supported coins id, name and symbol (no pagination required)
     * Use this to obtain all the coins’ id in order to make API calls
     * @category Coin
     * @param input.include_platform flag to include platform contract addresses (eg. 0x… for Ethereum based tokens).
  valid values: true, false
     * @returns {CoinListResponseItem[]}
     */
    CoinGeckoClient.prototype.coinList = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN_LIST, input)];
            });
        });
    };
    /**
     * List all supported coins price, market cap, volume, and market related data
     * @category Coin
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.order valid values: market_cap_desc, gecko_desc, gecko_asc, market_cap_asc, market_cap_desc, volume_asc, volume_desc, id_asc, id_desc
     * @param input.category filter by coin category, only decentralized_finance_defi and stablecoins are supported at the moment
     * @param input.ids The ids of the coin, comma separated crytocurrency symbols (base). refers to /coins/list. When left empty, returns numbers the coins observing the params limit and start
     * @param input.per_page Total results per page (valid values: 1…250)
     * @param input.page Page through results
     * @param input.sparkline Include sparkline 7 days data (eg. true, false)
     * @returns {CoinMarket[]}
     */
    CoinGeckoClient.prototype.coinMarket = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN_MARKET, input)];
            });
        });
    };
    /**
     * Get current data (name, price, market, ... including exchange tickers) for a coin
     * IMPORTANT:
     * Ticker object is limited to 100 items, to get more tickers, use /coins/{id}/tickers
     * Ticker is_stale is true when ticker that has not been updated/unchanged from the exchange for a while.
     * Ticker is_anomaly is true if ticker’s price is outliered by our system.
     * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.localization Include all localized languages in response (true/false)
     * @param input.tickers nclude tickers data (true/false) [default: true]
     * @param input.market_data Include market_data (true/false) [default: true]
     * @param input.community_data Include community_data data (true/false) [default: true]
     * @param input.developer_data Include developer_data data (true/false) [default: true]
     * @param input.sparkline Include sparkline 7 days data (eg. true, false)
     * @returns {CoinFullInfo}
     */
    CoinGeckoClient.prototype.coinId = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN, input)];
            });
        });
    };
    /**
     * Get coin tickers (paginated to 100 items)
     *
     * IMPORTANT:
     * Ticker is_stale is true when ticker that has not been updated/unchanged from the exchange for a while.
     * Ticker is_anomaly is true if ticker’s price is outliered by our system.
     * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.exchange_ids filter results by exchange_ids (ref: v3/exchanges/list)
     * @param input.include_exchange_logo flag to show exchange_logo
     * @param input.page Page through results
     * @param input.order valid values: trust_score_desc (default), trust_score_asc and volume_desc
     * @param input.depth flag to show 2% orderbook depth. valid values: true, false
     * @returns {CoinFullInfo}
     */
    CoinGeckoClient.prototype.coinIdTickers = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN_TICKERS, input)];
            });
        });
    };
    /**
     * Get historical data (name, price, market, stats) at a given date for a coin
     *
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.date The date of data snapshot in dd-mm-yyyy eg. 30-12-2017
     * @param input.localization Set to false to exclude localized languages in response
     * @returns {CoinHistoryResponse}
     */
    CoinGeckoClient.prototype.coinIdHistory = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN_HISTORY, input)];
            });
        });
    };
    /**
     * Get historical market data include price, market cap, and 24h volume (granularity auto)
     * Minutely data will be used for duration within 1 day, Hourly data will be used for duration between 1 day and 90 days, Daily data will be used for duration above 90 days.
     *
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.days Data up to number of days ago (eg. 1,14,30,max)
     * @param input.interval Data interval. Possible value: daily
     * @returns {CoinMarketChartResponse}
     */
    CoinGeckoClient.prototype.coinIdMarketChart = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN_MARKET_CHART, input)];
            });
        });
    };
    /**
     * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)
     * Minutely data will be used for duration within 1 day, Hourly data will be used for duration between 1 day and 90 days, Daily data will be used for duration above 90 days.
     *
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.from From date in UNIX Timestamp (eg. 1392577232)
     * @param input.to To date in UNIX Timestamp (eg. 1618716149)
     * @returns {CoinMarketChartResponse}
     */
    CoinGeckoClient.prototype.coinIdMarketChartRange = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN_MARKET_CHART_RANGE, input)];
            });
        });
    };
    /**
     * Get status updates for a given coin (beta)
     *
     * @see https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__status_updates
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.per_page Total results per page
     * @param input.page Page through results
     * @returns {CoinStatusUpdateResponse}
     */
    CoinGeckoClient.prototype.coinIdStatusUpdates = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN_STATUS_UPDATES, input)];
            });
        });
    };
    /**
     * Get coin's OHLC (Beta)
     * ```
     * Candle’s body:
     * 1 - 2 days: 30 minutes
     * 3 - 30 days: 4 hours
     * 31 and before: 4 days
     * ```
     * @see https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__ohlc
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.days Data up to number of days ago (1/7/14/30/90/180/365/max)
     * @returns {CoinStatusUpdateResponse}
     * Sample output
     * ```
     * [
     *  [
     *    1618113600000,
     *    79296.36,
     *    79296.36,
     *    79279.94,
     *    79279.94
     *   ]
     * . ... ... . .. . .. . . . . .
     * ]
     *```
     */
    CoinGeckoClient.prototype.coinIdOHLC = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.COIN_OHLC, input)];
            });
        });
    };
    /**
     * Get the current price of any cryptocurrencies in any other supported currencies that you need.
     * @param input.vs_currencies vs_currency of coins, comma-separated if querying more than 1 vs_currency. *refers to simple/supported_vs_currencies
     * @param input.ids The ids of the coin, comma separated crytocurrency symbols (base). refers to /coins/list. When left empty, returns numbers the coins observing the params limit and start
     * @param input.include_market_cap @default false
     * @returns {SimplePriceResponse}
     * @category Simple
     */
    CoinGeckoClient.prototype.simplePrice = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.SIMPLE_PRICE, input)];
            });
        });
    };
    /**
    * Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.
    * @param input.id The id of the platform issuing tokens (Only ethereum is supported for now)
    * @param input.contract_addresses The contract address of tokens, comma separated
    * @param input.vs_currencies vs_currency of coins, comma-separated if querying more than 1 vs_currency. *refers to simple/supported_vs_currencies
    * @returns The dictionary of price pair with details
    * * Example output
    * ```json
    * {
    *    "0x8207c1ffc5b6804f6024322ccf34f29c3541ae26": {
    *      "btc": 0.00003754,
    *      "btc_market_cap": 7914.297728099776,
    *      "btc_24h_vol": 2397.477480037078,
    *      "btc_24h_change": 3.7958858800037834,
    *      "eth": 0.0009474,
    *      "eth_market_cap": 199730.22336519035,
    *      "eth_24h_vol": 60504.258122696505,
    *      "eth_24h_change": 2.8068351977135007,
    *      "last_updated_at": 1618664199
    *   }
    *}
    *```
    * @category Simple
    */
    CoinGeckoClient.prototype.simpleTokenPrice = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.SIMPLE_TOKEN_PRICE, input)];
            });
        });
    };
    /**
    * Get list of supported_vs_currencies.
    * @returns list of supported_vs_currencies
    * @category Simple
    */
    CoinGeckoClient.prototype.simpleSupportedCurrencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.SIMPLE_SUPPORTED_CURRENCIES)];
            });
        });
    };
    /**
    * Get historical market data include price, market cap, and 24h volume (granularity auto) from a contract address
    * @see https://www.coingecko.com/api/documentations/v3#/contract/get_coins__id__contract__contract_address_
    * @returns current data for a coin
    * @param input.id Asset platform (only ethereum is supported at this moment)
    * @param input.contract_address Token’s contract address
    * @category Contract
    * @returns {CoinFullInfo}
    */
    CoinGeckoClient.prototype.contract = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.CONTRACT, input)];
            });
        });
    };
    /**
    * Get historical market data include price, market cap, and 24h volume (granularity auto)
    * @see https://www.coingecko.com/api/documentations/v3#/contract/get_coins__id__contract__contract_address__market_chart_
    * @returns current data for a coin
    * @param input.id Asset platform (only ethereum is supported at this moment)
    * @param input.contract_address Token’s contract address
    * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
    * @param input.days Data up to number of days ago (eg. 1,14,30,max)
    * @category Contract
    * @returns {CoinMarketChartResponse}
    */
    CoinGeckoClient.prototype.contractMarketChart = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.CONTRACT_MARKET_CHART, input)];
            });
        });
    };
    /**
    * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto) from a contract address
    * @see https://www.coingecko.com/api/documentations/v3#/contract/get_coins__id__contract__contract_address__market_chart_range
    * @returns current data for a coin
    * @param input.id Asset platform (only ethereum is supported at this moment)
    * @param input.contract_address Token’s contract address
    * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
    * @param input.from From date in UNIX Timestamp (eg. 1392577232)
    * @param input.to From date in UNIX Timestamp (eg. 1618716149)
    * @category Contract
    * @returns {CoinMarketChartResponse} Get historical market data include price, market cap, and 24h volume
    */
    CoinGeckoClient.prototype.contractMarketChartRange = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.CONTRACT_MARKET_CHART_RANGE, input)];
            });
        });
    };
    /**
      * List all exchanges
      * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges
      * @returns List all exchanges
      * @param input.per_page Total results per page (valid values: 1…250)
      * @param input.page Page through results
      * @category Exchange
      * @returns {CoinMarketChartResponse} Get historical market data include price, market cap, and 24h volume
      */
    CoinGeckoClient.prototype.exchanges = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EXCHANGES, input)];
            });
        });
    };
    /**
      * List all supported markets id and name (no pagination required)
      * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges_list
      * @returns Use this to obtain all the markets’ id in order to make API calls
      * @category Exchange
      * @returns {NameIdPair[]} Get historical market data include price, market cap, and 24h volume
      */
    CoinGeckoClient.prototype.exchangeList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EXCHANGE_LIST)];
            });
        });
    };
    /**
    * List all supported markets id and name (no pagination required)
    * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges__id_
    * @param id the exchange id (can be obtained from /exchanges/list) eg. binance
    * @returns Use this to obtain all the markets’ id in order to make API calls
    * ```
    * IMPORTANT:
    * Ticker object is limited to 100 items, to get more tickers, use /exchanges/{id}/tickers
    * Ticker is_stale is true when ticker that has not been updated/unchanged from the exchange for a while.
    * Ticker is_anomaly is true if ticker’s price is outliered by our system.
    * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
    * ```
    * @category Exchange
    * @returns {ExchangeId} Get exchange volume in BTC and top 100 tickers only
    */
    CoinGeckoClient.prototype.exchangeId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EXCHANGE_ID, { id: id })];
            });
        });
    };
    /**
      * Get exchange tickers (paginated, 100 tickers per page)
      * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges__id__tickers
      * @param input.id pass the exchange id (can be obtained from /exchanges/list) eg. binance
      * @param input.coin_ids filter tickers by coin_ids (ref: v3/coins/list)
      * @param input.include_exchange_logo flag to show exchange_logo
      * @param input.page Page through results
      * @param input.depth flag to show 2% orderbook depth i.e., cost_to_move_up_usd and cost_to_move_down_usd
      * @returns Use this to obtain all the markets’ id in order to make API calls
      * ```
      * IMPORTANT:
      * Ticker object is limited to 100 items, to get more tickers, use /exchanges/{id}/tickers
      * Ticker is_stale is true when ticker that has not been updated/unchanged from the exchange for a while.
      * Ticker is_anomaly is true if ticker’s price is outliered by our system.
      * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
      * ```
      * @category Exchange
      * @returns {ExchangeIdTickerResponse} Get exchange volume in BTC and top 100 tickers only
      */
    CoinGeckoClient.prototype.exchangeIdTickers = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EXCHANGE_ID_TICKER, input)];
            });
        });
    };
    /**
     * Get status updates for a given exchange (beta)
     * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges__id__status_updates
     * @param input.id pass the exchange id (can be obtained from /exchanges/list) eg. binance
     * @param input.page Page through results
     * @param input.per_page Total results per page
     * @returns Get status updates for a given exchange
     * @category Exchange
     * @returns {CoinStatusUpdateResponse} Get status updates for a given exchange
     */
    CoinGeckoClient.prototype.exchangeIdStatusUpdates = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EXCHANGE_ID_STATUS_UPDATES, input)];
            });
        });
    };
    /**
     * Get status updates for a given exchange (beta)
     * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges__id__volume_chart
     * @param input.id pass the exchange id (can be obtained from /exchanges/list) eg. binance
     * @param input.days Data up to number of days ago (eg. 1,14,30)
     * @returns Get status updates for a given exchange
     * @category Exchange
     * @returns {CoinStatusUpdateResponse} Get status updates for a given exchange
     */
    CoinGeckoClient.prototype.exchangeIdVolumeChart = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EXCHANGE_ID_VOL_CHART, input)];
            });
        });
    };
    /**
     * List all finance platforms
     * @see https://www.coingecko.com/api/documentations/v3#/finance_(beta)/get_finance_platforms
     * @param input.per_page Total results per page
     * @param input.page Data up to number of days ago (eg. 1,14,30)
     * @category Finance
     * @returns {Finance[]}
     */
    CoinGeckoClient.prototype.financePlatforms = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.FINANCE_PLATFORM, input)];
            });
        });
    };
    /**
     * List all finance products
     * @see https://www.coingecko.com/api/documentations/v3#/finance_(beta)/get_finance_products
     * @param input.per_page Total results per page
     * @param input.page Data up to number of days ago (eg. 1,14,30)
     * @category Finance
     * @returns {Finance[]}
     */
    CoinGeckoClient.prototype.financeProducts = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.FINANCE_PRODUCT, input)];
            });
        });
    };
    /**
     * List all market indexes
     * @see https://www.coingecko.com/api/documentations/v3#/indexes_(beta)/get_indexes
     * @param input.per_page Total results per page
     * @param input.page Data up to number of days ago (eg. 1,14,30)
     * @category Indexes
     * @returns {IndexItem[]}
     */
    CoinGeckoClient.prototype.indexes = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.INDEXES, input)];
            });
        });
    };
    /**
     * get market index by market id and index id
     * @see https://www.coingecko.com/api/documentations/v3#/indexes_(beta)/get_indexes__market_id___id_
     * @param input.market_id pass the market id (can be obtained from /exchanges/list)
     * @param input.path_id pass the index id (can be obtained from /indexes/list)
     * @param input.id pass the index id (can be obtained from /indexes/list)
     * @category Indexes
     * @returns {IndexItem[]}
     */
    CoinGeckoClient.prototype.indexesMarketId = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.INDEXES_MARKET_ID, input)];
            });
        });
    };
    /**
    * list market indexes id and name
    * @see https://www.coingecko.com/api/documentations/v3#/indexes_(beta)/get_indexes_list
    * @category Indexes
    * @returns {NameIdPair[]}
    */
    CoinGeckoClient.prototype.indexesList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.INDEXES_LIST)];
            });
        });
    };
    /**
    * List all derivative tickers
    * @see https://www.coingecko.com/api/documentations/v3#/derivatives_(beta)/get_derivatives
    * @param input.include_tickers 'all’, ‘unexpired’] - expired to show unexpired tickers, all to list all tickers, defaults to unexpired
    * @category Derivatives
    * @returns {Derivative[]}
    */
    CoinGeckoClient.prototype.derivatives = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.DERIVATIVES, input)];
            });
        });
    };
    /**
    * List all derivative tickers
    * @see https://www.coingecko.com/api/documentations/v3#/derivatives_(beta)/get_derivatives_exchanges
    * @param input.order order results using following params name_asc，name_desc，open_interest_btc_asc，open_interest_btc_desc，trade_volume_24h_btc_asc，trade_volume_24h_btc_desc
    * @param input.page Page through results
    * @param input.per_page  Total results per page
    * @category Derivatives
    * @returns {DerivativeExchange[]}
    */
    CoinGeckoClient.prototype.derivativesExchanges = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.DERIVATIVES_EXCHANGES, input)];
            });
        });
    };
    /**
    * show derivative exchange data
    * @see https://www.coingecko.com/api/documentations/v3#/derivatives_(beta)/get_derivatives_exchanges__id_
    * @param input.id pass the exchange id (can be obtained from derivatives/exchanges/list) eg. bitmex
    * @param input.include_tickers ['all’, ‘unexpired’] - expired to show unexpired tickers, all to list all tickers, leave blank to omit tickers data in response
    * @category Derivatives
    * @returns {DerivativeExchange}
    */
    CoinGeckoClient.prototype.derivativesExchangesId = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.DERIVATIVES_EXCHANGES_ID, input)];
            });
        });
    };
    /**
    * List all derivative exchanges name and identifier
    * @see https://www.coingecko.com/api/documentations/v3#/derivatives_(beta)/get_derivatives_exchanges_list
    * @category Derivatives
    * @returns {NameIdPair[]}
    */
    CoinGeckoClient.prototype.derivativesExchangesList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.DERIVATIVES_EXCHANGES_LIST)];
            });
        });
    };
    /**
    * List all status_updates with data (description, category, created_at, user, user_title and pin)
    * @see https://www.coingecko.com/api/documentations/v3#/status_updates_(beta)/get_status_updates
    * @param input.category Filtered by category (eg. general, milestone, partnership, exchange_listing, software_release, fund_movement, new_listings, event)
    * @param input.project_type Filtered by Project Type (eg. coin, market). If left empty returns both status from coins and markets.
    * @param input.per_page Total results per page
    * @param input.page Page through results
    * @category Status Updates
    * @returns {CoinStatusUpdateResponse}
    */
    CoinGeckoClient.prototype.statusUpdates = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.STATUS_UPDATES, input)];
            });
        });
    };
    /**
    * Get events, paginated by 100
    * @see https://www.coingecko.com/api/documentations/v3#/events/get_events
    * @param input.country_code country_code of event (eg. ‘US’). use /api/v3/events/countries for list of country_codes
    * @param input.type ype of event (eg. ‘Conference’). use /api/v3/events/types for list of types
    * @param input.page page of results (paginated by 100)
    * @param input.upcoming_events_only lists only upcoming events.(defaults to true, set to false to list all events)
    * @param input.from_date lists events after this date yyyy-mm-dd
    * @param input.to_date lists events before this date yyyy-mm-dd (set upcoming_events_only to false if fetching past events)
    * @category Events
    * @returns {EventResponse}
    */
    CoinGeckoClient.prototype.events = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EVENTS, input)];
            });
        });
    };
    /**
    * Get list of event countries
    * @see https://www.coingecko.com/api/documentations/v3#/events/get_events_countries
    * @category Events
    * @returns {EventCountryResponse}
    */
    CoinGeckoClient.prototype.eventsCountries = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EVENTS_COUNTRIES)];
            });
        });
    };
    /**
    * Get list of events types
    * @see https://www.coingecko.com/api/documentations/v3#/events/get_events_types
    * @category Events
    * @returns {EventCountryResponse}
    */
    CoinGeckoClient.prototype.eventsTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EVENTS_TYPES)];
            });
        });
    };
    /**
    * Get BTC-to-Currency exchange rates
    * @see https://www.coingecko.com/api/documentations/v3#/exchange_rates/get_exchange_rates
    * @category Exchange Rates
    * @returns {ExchangeRatesResponse}
    */
    CoinGeckoClient.prototype.exchangeRates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.EXCHANGE_RATES)];
            });
        });
    };
    /**
    * Get cryptocurrency global data
    * @see https://www.coingecko.com/api/documentations/v3#/global/get_global
    * @category Global
    * @returns {GlobalResponse} Get global data - total_volume, total_market_cap, ongoing icos etc
    */
    CoinGeckoClient.prototype.global = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.GLOBAL)];
            });
        });
    };
    /**
    * Get cryptocurrency global decentralized finance(defi) data
    * @see https://www.coingecko.com/api/documentations/v3#/global/get_global
    * @category Global
    * @returns {GlobalDefiResponse} Get Top 100 Cryptocurrency Global Eecentralized Finance(defi) data
    */
    CoinGeckoClient.prototype.globalDefi = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Enum_ts_1.API_ROUTES.GLOBAL_DEFI)];
            });
        });
    };
    return CoinGeckoClient;
}());
exports.CoinGeckoClient = CoinGeckoClient;
