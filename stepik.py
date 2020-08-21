import requests
from lxml import etree
import json
import re
import xml.dom.minidom
import urllib.request


def main():
    html = html_get()
    all_prices = get_all_prices(html)
    convert_prices = get_convert_prices(all_prices)
    floats = get_floats(html)
    resault(floats, convert_prices)


def html_get():
    html = requests.get("https://steamcommunity.com/market/listings/730/M4A1-S%20%7C%20Decimator%20%28Field-Tested%29").text
    print('Запрос на сервер стим')
    return html


def get_all_prices(html):
    parser = etree.HTMLParser()
    root = etree.fromstring(html, parser)
    price = root.xpath('.//span[@class = "market_listing_price market_listing_price_with_fee"]/text()')
    return price


def get_currency():
    currency_xml = urllib.request.urlopen('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml')
    currency_xml_root = xml.dom.minidom.parse(currency_xml)
    cube = currency_xml_root.getElementsByTagName("Cube")
    cur_dict = {'EUR': 1,
                'TWD': 35,
                'KZT': 500,
                }
    for i in cube[2:]:
        cur_dict.update({i.getAttribute("currency"): float(i.getAttribute("rate"))})
    return cur_dict


def is_in_steam_cur_mark(price):
        steam_cur_mark = {'€': 'EUR', 'USD': 'USD', 'zł': 'PLN',
                          '¥': 'CNY', '£': 'GBP', 'pуб.': 'RUB',
                          '฿': 'THB', '₹': 'INR', 'NT$': 'TWD',
                          'Rp': 'INR', 'Rs': 'INR', '₪': 'ILS',
                          'TL': 'TRY', '₩': 'KRW', '₦': 'NGN',
                          '₸': 'KZT', 'kr': 'SEK', }
        for k in steam_cur_mark:
            if k in price:
                return steam_cur_mark[k]
        return False


def get_convert_prices(all_prices_f):
    price_list = []
    cur_dict = get_currency()
    for price in all_prices_f:
        cur = is_in_steam_cur_mark(price)
        if cur:
            clean_prise = re.findall(r'(\d+[.,]?\d*)', price)
            price_list.append(str(round(float(clean_prise[0].replace(',', '.')) / cur_dict[cur] * cur_dict['RUB'], 2)) + ' руб  ' + price.strip())
        else:
            price_list.append('Такая валюта отсутствует: {}'.format(price.strip()))
    return price_list


def get_floats(html):
    floats = []
    for match in re.findall(r'steam:\\/\\/rungame\\/730\\/76561202255233023\\/\+csgo_econ_action_preview%(\d{2}\w{1}\d+)A%assetid%D(\d+).*?"id":"(\d+)', html):
        a, b, c = match
        float_check = requests.get('https://api.csgofloat.com/?url=steam://rungame/730/76561202255233023/+csgo_econ_action_preview%{}A{}D{}'.format(a, c, b))
        data_json = json.loads(float_check.text)
        floats.append(data_json['iteminfo']['floatvalue'])
    return floats


def resault(floats, convert_prices):
    for i in range(9):
        print(i+1, '   ', floats[i], '   ', convert_prices[i])


if __name__ == '__main__':
    main()
