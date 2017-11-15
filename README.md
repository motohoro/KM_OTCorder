# KM_OTCorder

とあるWebページにjavascriptを差し込むFirefoxの拡張機能

## Install
Firefoxで https://github.com/motohoro/KM_OTCorder/releases/latest へアクセスして拡張機能（km_otcorder～～.xpi）をクリックしてインストール

## 使い方
該当ページにボタンが表示されます（[参考画像](https://github.com/motohoro/KM_OTCorder/issues/1) ）

* [バーコードスキャン開始]でPCに接続されたカメラを使ってバーコード読み込みできます
  * サイトでカメラの使用をするときには許可しますか？というダイアログが表示されます。許可して下さい
  （「常に許可」すると次回からこのダイアログが表示されずに便利ですが、、セキュリティー的な面での検討して決めて下さい）
* [スキャン停止]で読み込み中止
* [バーコード表示]で品目と数量が反映されたQRコードが表示されるので印刷して次回以降に活用できます

## 使用ライブラリ
jquery
js.cookie
instascan
