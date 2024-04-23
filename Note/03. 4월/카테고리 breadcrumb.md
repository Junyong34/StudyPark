
https://front-qa.homeplus.kr/category/getCategoryInfo.json?cateCd=200428

```json
{
    "returnStatus": 200,
    "data": {
        "attributeInfo": null,
        "promotionInfo": {
            "promotionList": [
                {
                    "linkInfo": 6378,
                    "imgUrl": "/ba/db547eb6-0b4e-444d-9e77-20661453d5f3",
                    "linkType": "EXH",
                    "exhStoreType": "HYPER",
                    "promoNm": "단독특가"
                }
            ]
        },
        "bigBannerInfo": null,
        "categoryInfo": {
            "lcateCd": 100064,
            "cateNm": "감/홍시/곶감/밤 ",
            "displayType": "typeA",
            "lcateNm": "과일",
            "cateDepth": "M",
            "categoryList": [
                {
                    "cateNm": "감/홍시/곶감/밤 ",
                    "displayType": "typeA",
                    "cateDepth": "S",
                    "cateCd": 301970
                }
            ],
            "cateCd": 200428
        }
    },
    "returnCode": "SUCCESS",
    "returnMessage": "",
    "boUrl": "http://api-gateway.homeplus:8080/api/display/category/getCategoryInfo?siteType=HOME&cateCd=200428",
    "boUrls": null
}
```
https://front-qa.homeplus.kr/category/pc/getMap.json

2개 api 사용


## 구 (PC) 
### Hyper Category

- 자동차/레저 (대)
- 스포츠/레저(대)
- 구기/라켓스포츠(중)
- 야구,축구, 배트민턴 ... (소)
- ![[Pasted image 20240419144816.png]]

카테고리는 
- 대  1개만 breadCrumb 노출 
- 대, 중 2개만 breadCrumb 노출 

api 2개 사용
- category.json(params cateCd) (breadCrumb에 선택한 cateCD값)
- getMap.json (전체 카테고리)
- ![[Pasted image 20240422082946.png]]
```json

	
```


api 가능여부
- cateCd 값을 파라미터로 넘기면 자기 상위 부모 CateList 값 가져올 수있는지

category.json 값을 가지고  getMap.json 데이터를 찾아서 list를 만든다 (L , M )




### Hyper Items detail

api
- getCategory.json (cateCde 값으로 L, M, S 값 가져옴)


### express category
- 대분류 만 가져오고, 나머지는 필터에서 처리 작업 진행함

![[Pasted image 20240419154215.png]]


express category api 종류
 express 카테고리 구조는 1(L) , 2(M)  2단 depth로 구성 되어있음 

- category 화면
	- categoryCd 값으로 api 호출시  depth에 해당되는 카테고리 list 값을 리턴 한다.

- 아이템 상세 화면
	- l,m,s  3개 categoryCd params를 넘기면 3개에 해당되는 카테고리 list 값을 리턴한다.
	- itemNo 값을 넘기면 해당 아이템 카테고리 L, M, S 값을 리턴한다.

1. /express/getCategories?cateCd='700008'
2. /express/item/getCategories?itemNo='10003728'
