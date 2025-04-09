import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 10, duration: '30s' },
        { target: 15, duration: '1m' },
        { target: 10, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  const vars = {}

  group('page_2 - https://pizza.edwardscs.click/', function () {
    response = http.get('https://pizza.edwardscs.click/', {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'if-modified-since': 'Sun, 09 Mar 2025 05:35:23 GMT',
        'if-none-match': '"81c3aa0c686ac2cb7b6484744ab2b94b"',
        priority: 'u=0, i',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
      },
    })
    sleep(17.4)

    response = http.put(
      'https://pizza-service.edwardscs.click/api/auth',
      '{"email":"d@jwt.com","password":"diner"}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          origin: 'https://pizza.edwardscs.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Login was *not* 200');
    }

    vars['token1'] = jsonpath.query(response.json(), '$.token')[0]

    sleep(6.2)

    response = http.get('https://pizza-service.edwardscs.click/api/order/menu', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        authorization: `Bearer ${vars['token1']}`,
        'content-type': 'application/json',
        origin: 'https://pizza.edwardscs.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })

    response = http.get('https://pizza-service.edwardscs.click/api/franchise', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        authorization: `Bearer ${vars['token1']}`,
        'content-type': 'application/json',
        origin: 'https://pizza.edwardscs.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })
    sleep(15.3)

    response = http.post(
      'https://pizza-service.edwardscs.click/api/order',
      '{"items":[{"menuId":2,"description":"Pepperoni","price":0.0042},{"menuId":3,"description":"Margarita","price":0.0042},{"menuId":4,"description":"Crusty","price":0.0028},{"menuId":5,"description":"Charred Leopard","price":0.0099},{"menuId":5,"description":"Charred Leopard","price":0.0099}],"storeId":"1","franchiseId":1}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          authorization: `Bearer ${vars['token1']}`,
          'content-type': 'application/json',
          origin: 'https://pizza.edwardscs.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    if (!check(response, { 'purchase status is 201': r => r.status === 201 })) {
      console.log(response.body)
      fail('Purchase request did *not* return 201 Created')
    }
    sleep(2)

    response = http.post(
      'https://pizza-factory.cs329.click/api/order/verify',
      '{"jwt":"eyJpYXQiOjE3NDQyMjQ4MjMsImV4cCI6MTc0NDMxMTIyMywiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJiZWR3YXJkeiIsIm5hbWUiOiJCZXRoYW55IEVkd2FyZHMifSwiZGluZXIiOnsiaWQiOjIsIm5hbWUiOiJwaXp6YSBkaW5lciIsImVtYWlsIjoiZEBqd3QuY29tIn0sIm9yZGVyIjp7Iml0ZW1zIjpbeyJtZW51SWQiOjIsImRlc2NyaXB0aW9uIjoiUGVwcGVyb25pIiwicHJpY2UiOjAuMDA0Mn0seyJtZW51SWQiOjMsImRlc2NyaXB0aW9uIjoiTWFyZ2FyaXRhIiwicHJpY2UiOjAuMDA0Mn0seyJtZW51SWQiOjQsImRlc2NyaXB0aW9uIjoiQ3J1c3R5IiwicHJpY2UiOjAuMDAyOH0seyJtZW51SWQiOjUsImRlc2NyaXB0aW9uIjoiQ2hhcnJlZCBMZW9wYXJkIiwicHJpY2UiOjAuMDA5OX0seyJtZW51SWQiOjUsImRlc2NyaXB0aW9uIjoiQ2hhcnJlZCBMZW9wYXJkIiwicHJpY2UiOjAuMDA5OX1dLCJzdG9yZUlkIjoiMSIsImZyYW5jaGlzZUlkIjoxLCJpZCI6NjB9fQ.iYJHHyFILSXhzfq2SuemuSwYBmvChZNcXYmX3qRqMJb-ZbjeTc1SvOy7Un-AXwU4VK2LjqledXTp6EYseVfu5dZzTmsEl78uMqfcqgDX3sy2jK2RLl2U9mVwygUbFF7lnzOs5QTCV_mDl4AkxWJ1lyE_H99GR2WKOq-aQE_K7Hnz7g0yetT9lNhWWsqDd8U4AusN0XGdMU-1zdT221Jjl3efY39Pyib8pUh-Ut9jGPWnftxU3gj7Fp4XzdM5Gar29ttiZIFiDjsD3JT8NyR_4lqZ9bGdbJxytnyJ8H8h4PpQg0NYE-WIgCHIXA66pGF7GiA53wYijhynbvwMNmU113Hz2Tev0CmGxQoZbH9bnTqB9-tVPKi-r35TX_3_NVDc6f-GctYmztgUYQTDrP7WG-lkZiU0ireqiIV5NGONonb07Kr_4SXoHfWUMfd-gWgtIJOSOO6JC955RNnurFBiUYophmEPsv94-a_gxujt-EYLc7ULkvJQa2mFWH3qaBqq789lXXqXN_MfeXk1kKpTIrXLaf5UCFw2bvx6KsWHRTtMPzFfh55_LQMgOuLSJcw7ighjwxejrVEodTHOf-T9UhI-xVrx4xyy3vPinfZ9zkF_aT78C0Wzf-1DuSIih_JVXuqxKbKWkyOQCI59IPjIK6lL7tr1LOAI03nmFfAVUsA"}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          authorization: `Bearer ${vars['token1']}`,
          'content-type': 'application/json',
          origin: 'https://pizza.edwardscs.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-storage-access': 'none',
        },
      }
    )
  })
}