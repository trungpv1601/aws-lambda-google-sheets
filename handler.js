"use strict";

const creds = require('./config/myapp-1dd646d7c2af.json');
const { GoogleSpreadsheet } = require("google-spreadsheet");

/**
 * [description]
 * @param  {[type]} data    [description]
 * @param  array headersArr [description]
 * @return {[type]}         [description]
 */
const convertData = (data, headersArr) => {
  return headersArr.reduce(function(result, item, index) {
    result[item] = data[item] ? data[item] : "";
    return result;
  }, {});
};

/**
 * [description]
 * @param  {[type]} sheet      [description]
 * @param  {[type]} headersArr [description]
 * @param  {[type]} page       [description]
 * @param  {[type]} limit      [description]
 * @return {[type]}            [description]
 */
const getData = async (sheet, headersArr, page, limit) => {
  try {
    let offset = (page - 1) * limit;

    // Get row data
    const rows = await sheet.getRows({ limit, offset });

    // Empty array for our data
    let data = [];

    // If we have data
    if (rows.length > 0) {
      // Iterate through the array of rows
      // and push the clean data from your spreadsheet
      rows.forEach((row) => {
        data.push(convertData(row, headersArr));
      });
    }

    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * [description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
module.exports.sheets = async (event) => {
  const { queryStringParameters } = event;

  let page = 1;
  let limit = 10;
  let sheetNumber = 0;

  if (queryStringParameters && queryStringParameters.sheet) {
    sheetNumber = queryStringParameters.sheet;
  }

  if (queryStringParameters && queryStringParameters.page) {
    page = parseInt(queryStringParameters.page);
    page = Number.isInteger(page) && page > 0 ? page : 1;
  }

  if (queryStringParameters && queryStringParameters.limit) {
    limit = parseInt(queryStringParameters.limit);
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;
  }

  if (!queryStringParameters || !queryStringParameters.docId) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          success: false,
          message: "Please provice a docId param.",
        },
        null,
        2
      ),
    };
  }

  if (!queryStringParameters || !queryStringParameters.headers) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          success: false,
          message: "Please provice a headers param.",
        },
        null,
        2
      ),
    };
  }

  try {
    const { docId, headers } = queryStringParameters;

    const headersArr = headers.split("|");

    const doc = new GoogleSpreadsheet(docId);
    await doc.useServiceAccountAuth(creds);

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[sheetNumber];

    const total = sheet.rowCount;

    let rows = [];

    try {
      rows = await getData(sheet, headersArr, page, limit);
    } catch (e) {}

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          success: true,
          data: rows,
          total,
          page,
          limit,
          message: "Successfully!",
        },
        null,
        2
      ),
    };
  } catch (e) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          success: false,
          message: e.message,
        },
        null,
        2
      ),
    };
  }
};
