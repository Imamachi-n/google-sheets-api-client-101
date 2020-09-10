import { google } from "googleapis";

// Promise化したスプレッドシートの値取得用の関数
function getSpreadSheetData(sheets: any, params: any) {
  return new Promise<any>((resolve, reject) => {
    sheets.spreadsheets.values.get(params, (err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

(async () => {
  // サービスアカウント情報を利用したクライアント認証
  // const jwtClient = new google.auth.JWT(
  //   credentials.client_email,
  //   undefined,
  //   credentials.private_key,
  //   ["https://www.googleapis.com/auth/spreadsheets"]
  // );
  // jwtClient.authorize();
  const auth = new google.auth.GoogleAuth({
    keyFile: __dirname + "/crendetials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const res = await getSpreadSheetData(sheets, {
      spreadsheetId: "1yYsKJaYE05UYnCJ5WBsX6aIU0dINBApow54ptPcWZCM",
      range: "プライベートOKR",
    });

    if (res === null || res === undefined) {
      throw new Error(
        `スプレッドシートの情報を取得できませんでした。
        アクセス権限があるかどうか、スプレッドシートのIDが間違っていないか確認してください...`
      );
    }
    const rows = res.data.values;
    if (rows === undefined) {
      throw new Error("スプレッドシートの中身が空っぽです...");
    }

    if (rows.length === 0) {
      throw new Error("スプレッドシートの中身が空っぽです...");
    }

    console.log(rows);
  } catch (err) {
    throw new Error(`APIのエラーが発生しました: ${err}`);
  }
})().catch((err) => {
  console.log(err);
});
