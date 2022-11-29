const axios = require('axios').default
const cheerio = require('cheerio')

// 銀行匯率比較·匯率查詢·匯率換算 FindRate.TW
const url = 'https://www.findrate.tw/currency.php#.Y1DbLPzispQ'

async function getCurrencyData () {
  const response = await axios.get(url)
  const $ = cheerio.load(response.data)

  // table 的欄位名稱
  const columnName = [] // Array<string>
  // table 的內容 ， 用一個 array 包住所有幣別資料，每一種幣別資料都用一個 array 包住
  const columnContent = [] // Array<Array<string>>

  $('table tbody tr').each((i, el) => {
    // i = 0 表示 table 第一行，欄位名稱
    if (i === 0) {
      $(el)
        .find('th')
        .each((i, el) => {
          columnName.push($(el).text())
        })
    }
    // i /= 0 為幣種匯率資料
    else {
      const tempArray = []
      $(el)
        .find('td')
        .each((i, el) => {
          // class = flag 為幣種名稱
          if ($(el).hasClass('flag')) {
            tempArray.push(
              $(el)
                .find('a')
                .text()
            )
          }
          // class = bank 為匯率最佳銀行
          else if ($(el).hasClass('bank')) {
            tempArray.push(
              $(el)
                .find('a')
                .text()
            )
          }
          // 其他沒有分類是分別是 : '現金買入', '現金賣出', '更新時間'
          else {
            tempArray.push($(el).text())
          }
        })
      columnContent.push(tempArray)
    }
  })
  const result = { columnName, columnContent }
  console.log(result)
  // 真正要使用時，把 console.log 改成 return 即可
  // return result
}

getCurrencyData()
