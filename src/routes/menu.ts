/**
 * @swagger
 * definitions:
 *  menus:
 *   type: object
 *   required:
 *     - id
 *     - name
 *     - price
 *     - createdAt
 *   properties:
 *     id:
 *       type: string
 *       description: 객체 식별용 프로퍼티, 객체 생성 시 자동으로 설정
 *     name:
 *       type: string
 *       description: 메뉴 이름
 *     price:
 *       type: integer
 *       description: 메뉴의 가격
 *     createdAt:
 *       type: Date
 *       description: 식당이 DB에 추가된 날짜
 *     modifiedAt:
 *       type: Date
 *       description: 식당 정보가 수정된 날짜, 리뷰나 메뉴를 추가할 때도 변경됨
 */