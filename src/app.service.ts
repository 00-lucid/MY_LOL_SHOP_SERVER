import { Body, Injectable, Post } from '@nestjs/common';
import axios from 'axios';
import e from 'express';
import { Op, Sequelize } from 'sequelize';
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const { LineItem, Order, User, Item, Option, Dib, Review, Tag, statisticTag, Search, FilterTag, Bell } = require('../models');

// // interface는 들어오는 객체 프로퍼티의 타입을 지정하고 검사가 가능하게 한다
// interface Message {
//   message: string,
// }

// 모든게 끝나고 nest res 명령어를 사용한 것처럼 분리해야한다...
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async addLineItem(body) {
    // name img lineTotal validate check는 client에서
    // client에서 json된 데이터가 오고 그것을 그대로 저장한다.
    // 생성된 아이탬 이미지를 보내줄 때는?? => 생성할 때 db에 저장된 img Object를 가져와서 URL.createObjectURL(object)를 이용해서 url화 한 뒤 가져온다
    const createItem = await LineItem.create({
      name: body.name,
      img: body.img,
      itemId: body.itemId,
      lineTotal: body.lineTotal,
      userId: 2,
      buyOption: body.buyOption,
      buyCount: body.buyCount
    })
    return createItem;
  }

  async getLineItem() {
    const lineItemList = await LineItem.findAll()

    return lineItemList;
  }

  async addOrder(token, body) {
    // 주문 정보를 order table에 기록해야 함
    if (!token) {
      await Order.create({
        total: body.total
      })
    } else {
      return jwt.verify(token, 'salt', async (err, decoded) => {
        // 유저가 보유한 재화가 총합 금액 이상인지 체크
        const userRp = await User.findOne({
          where: {
            id: decoded.id
          },
          attributes: ['rp']
        })

        console.log(userRp.dataValues);
        console.log(body.total);

        if (userRp.dataValues.rp < body.total) {
          console.log('!!!!!!!!!!!!!!!!!!!!')
          throw new Error('잔액이 부족합니다')
        } else {
          // rp 차감
          await User.increment({
            rp: -body.total
          }, {
            where: {
              id: decoded.id
            }
          })

          const orderInfo = await Order.create({
            userId: decoded.id,
            total: body.total
          })
          await LineItem.update({
            // 생성된 오더 아이디가 들어가야 됨
            orderId: orderInfo.dataValues.id,
          }, {
            where: {
              userId: decoded.id,
              orderId: null
            }
          })
          // statisticTag table에 해당 아이탬의 태그가 들어가야함
          // 태그 어떻게 가져올 것인가??
          // 방금 생성한 오더 아이디를 통해서 유저가 구매한 아이탬리스트를 가져올 수 있음
          const buyItems = await LineItem.findAll({
            where: {
              orderId: orderInfo.dataValues.id,
            },
            include: {
              model: Item,
              attributes: ['id']
            }
          })
          // 해당 아이템 리스트와 include 옵션으로 쿼리를 보내서 tag를 구한다음 해당 statisticTag에 추가
          // buyItems 개수만큼 반복
    
          buyItems.forEach(async (buyItem) => {
            // 아이탬 아이디를 바탕으로 tag table에 요청을 보내서 tag들을 받아오고 그걸 바탕으로 또 statisticTag table 넣어줘야한다.
            const itemId = buyItem.dataValues.Item.id
            // buyItems는 Items의 count++을 해줘야 됨
            await Item.increment({
              count: +1,
            }, {
              where: {
                id: itemId
              }
            })

            const tags = await Tag.findAll({
              where: {
                itemId: itemId,
              }
            })
    
            tags.forEach(async (tag) => {
              const tagName = tag.dataValues.tag;
    
              await statisticTag.increment(
                {
                  count: + 1,
                },
                {
                where: {
                  tag: tagName
                }
              })
            })
          });
          console.log(4)
          await User.increment({
            buyCount: + 1,
          }, 
          {
            where: {
              id: decoded.id
            }
          }
          )
        }

        
      }
      )
    }
  }

  async signUp(body){
    // 회원가입
    // User 모델을 사용
    // validation check는 client에서 했음

    // db에 저장되는 비밀번호는 hash를 거쳐야 함
    let hashedPassword = await passwordHash.generate(body.password);

    // 회원가입후 자동로그인 O
    const userData = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      address: body.address,
    })

    // accToken send json, rfToken send cookie
    const accToken = await jwt.sign(
      // payload
      {
          id: userData.dataValues.id,
          name: body.name,
          email: userData.dataValues.email,
          address: userData.dataValues.address,
          tier: userData.dataValues.tier,
      }, 'salt',
      // option
      {
          expiresIn: '30m'
      }   
    );

    // const rfToken = await jwt.sign(
    //   //payload
    //   {
    //       id: userData.dataValues.id,
    //   }, 'salt',
    //   // option
    //   {
    //       expiresIn: '1h'
    //   }
    // );
    
    // res.cookie('rfToken', rfToken);
    // res.json({accToken: accToken});

    return {accToken: accToken}
  }

  async signIn(body) {
    // db와 req.body가 일치하는지 확인

    // email과 일치하는 data를 가져온 후, 해당 data의 hashpw와 body.password를 비교
    const userData = await User.findOne({
      where: {
        email: body.email,
      }
    })
    
    if (userData) {
      const isVerify = await passwordHash.verify(body.password, userData.dataValues.password)
  
      if (isVerify) {
        // accToken send json, rfToken send cookie
        const accToken = await jwt.sign(
          // payload
          {
              id: userData.dataValues.id,
              email: userData.dataValues.email,
              address: userData.dataValues.address,
              tier: userData.dataValues.tier,
          }, 'salt',
          // option
          {
              expiresIn: '30m'
          }   
        );
  
        return {accToken: accToken}
      } else {
        return {message: 'invalid email & password'}
      }
    } else {
      return {message: 'invalid email & password'}
    }
  }

  async getItemInfo(token, body) {
    // 들어온 body.id에 맞는 item을 response 해줘야 합니다.
    // 들어온 body.id에 맞는 item option들을 배열로 response 해줘야 합니다.
    let dib;

    const itemInfo = await Item.findOne({
      where: {
        id: body.id
      },
    })
    
    if (token) {
      jwt.verify(token, 'salt', async (err, decoded) => {
        const dibInfo = await Dib.findOne({
          where: {
            itemId: body.id,
            userId: decoded.id
          },
        })
        dib = dibInfo;
      })
    }

    const arrOption = await Option.findAll({
      where: {
        itemId: body.id
      }
    })

    const reviews = await Review.findAll({
      where: {
        itemId: body.id
      }
    })

    const curTags = await Tag.findAll({
      where: {
        itemId: body.id,
      }
    })

    let itemIds = [];
    for (let curTag of curTags) {
      const find = await Tag.findAll({
        where: {
          tag: curTag.dataValues.tag
        }
      })

      find.forEach(el => {
        if (el.dataValues.itemId !== body.id) {
          if (!itemIds.includes(el.dataValues.itemId)) {
            itemIds.push(el.dataValues.itemId);
          }
        }
      })
    }
    // 관련되는 아이탬들의 번호 모음
    // let itemIds = curTags.map(curTag => curTag.dataValues.itemId);


    const relationItems = await Item.findAll({
      where: {
        id: {
          [Op.in]: itemIds,
        }
      }
    })

    return Object.assign(itemInfo.dataValues, {arrOption: arrOption}, {reviews: reviews}, {relationItems: relationItems}, {dib: dib});
  }

  async getContacts(token){
    return jwt.verify(token, 'salt', async function (err, decoded): Promise<any> {
      // lineitems에서 구매처리가 된 것들만 반환해줘야 한다
      const lineItems = await LineItem.findAll({
        where: {
          userId: decoded.id,
          orderId: {
            [Op.ne]: null,
          }
        },
        // include option을 줘서 item id 도 함께 가져오자
        // LineItem id 와 Item id 충돌, 때문에 as 써줘야 됨
      })
      return lineItems;
    })
  }

  async getListOrders(token) {
    // orders와 lineitems 둘 모두에게서 데이터를 가져와야 함
    // jwt.verify(token, 'salt', async function(err, decoded) {
    //   console.log(decoded);
      const orderList = await Order.findAll({
        where: {
          userId: 2,
        }
      })
      return {orderList: orderList};
    // })
  }

  async getItemList() {
    const itemList = await Item.findAll();

    // 아이탬에서 가져올 때, img에 JSON화된 File Object가 존재한다. 이것을 처리한 뒤 보내줘야 client에서 유저가 생성한 아이탬 이미지가 잘 보여진다.
    // let result = itemList.map(item => {
    //   const parseItemImg = JSON.parse(item.img)
    //   if (typeof parseItemImg === 'object') {
    //     const urlItemImg = URL.createObjectURL(parseItemImg);
    //     item.img = urlItemImg;
    //     return item
    //   }
    // })

    return {
      itemList: itemList,
    };
  }

  async addDib(token, body) {
    // body = itemId
    return jwt.verify(token, 'salt', async function (err, decoded) { 
        const check = await Dib.findOne({
          where: {
            userId: decoded.id,
            itemId: body.id
          }
        })
        if (check) {
          await Dib.destroy({
            where: {
              userId: decoded.id,
              itemId: body.id
            }
          })
        } else {
          await Dib.findOrCreate(
            {
              where: {
                userId: decoded.id,
                itemId: body.id,
              }
            }
          )
        }

        return 'created';
    })
  }

  async getDibList(token) {
    return jwt.verify(token, 'salt', async function (err, decoded) {
      const dibList =  await Dib.findAll({
        where: {
          userId: decoded.id
        },
        include: [{
          model: Item,
        }]
      })  
      if (dibList) {
        return dibList;
      } else {
        return '찜목록이 없습니다'
      }
    })
  }

  async getUserInfo(token) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      const userInfo = await User.findOne({
        where: {
          id: decoded.id,
        }
      })
  
      delete userInfo.dataValues.password;
      // buy Count에 따른 티어 이미지와 남은 구매 횟수도 알려줘야 됨
      let tierInfo = { tierImg: '', tierNum: 0}
      if (userInfo.dataValues.buyCount > 100) {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/e48662f28115ee80b2e27a4ab16d2241.png"
        tierInfo.tierNum = 99999
        await User.update({
          tier: 'Challenger'
        }, {
          where: {
            id: decoded.id
          }
        })
      }
      else if (userInfo.dataValues.buyCount >= 40) {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/4377f47c6e65242762f685f87c6420a2.png"
        tierInfo.tierNum = 100 - userInfo.dataValues.buyCount
        await User.update({
          tier: 'GrandMaster'
        }, {
          where: {
            id: decoded.id
          }
        })
      }
      else if (userInfo.dataValues.buyCount >= 20) {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/1144f3345a6513055bcd854c6df0f20d.png"
        tierInfo.tierNum = 40 - userInfo.dataValues.buyCount
        await User.update({
          tier: 'Master'
        }, {
          where: {
            id: decoded.id
          }
        })
      }
      else if (userInfo.dataValues.buyCount >= 15) {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/f960127ec20a0948a4871c72aeeb0cd3.png"
        tierInfo.tierNum = 20 - userInfo.dataValues.buyCount
        await User.update({
          tier: 'Diamond'
        }, {
          where: {
            id: decoded.id
          }
        })
      }
      else if (userInfo.dataValues.buyCount >= 10) {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/ff8b61da354a9fe0728b908158775560.png"
        tierInfo.tierNum = 15 - userInfo.dataValues.buyCount
        await User.update({
          tier: 'Platinum'
        }, {
          where: {
            id: decoded.id
          }
        })
      }
      else if (userInfo.dataValues.buyCount >= 6) {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/0c853789bc35fbc277b433016f5cfaf5.png"
        tierInfo.tierNum = 10 - userInfo.dataValues.buyCount
        await User.update({
          tier: 'Gold'
        }, {
          where: {
            id: decoded.id
          }
        })
      }
      else if (userInfo.dataValues.buyCount >= 3) {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/ca18528cb69f37582a8d2074d6cdc11a.png"
        tierInfo.tierNum = 6 - userInfo.dataValues.buyCount
        await User.update({
          tier: 'Silver'
        }, {
          where: {
            id: decoded.id
          }
        })
      }
      else if (userInfo.dataValues.buyCount >= 1) {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/8f0185e298221bbe87fa5777d646294f.png"
        tierInfo.tierNum = 3 - userInfo.dataValues.buyCount
        await User.update({
          tier: 'Bronze'
        }, {
          where: {
            id: decoded.id
          }
        })
      }
      else {
        tierInfo.tierImg = "https://img.fmnation.net/files/attach/images/3423/628/779/063/3c62c3572310e427e1c2aefbaa41becb.png"
        tierInfo.tierNum = 1 - userInfo.dataValues.buyCount
      }

      const result = Object.assign({}, userInfo.dataValues, tierInfo);

      return result
    })
  }

  async deleteLineItem(token, body) {
    // lineitem db에서 body에 앎맞는 data를 지운 뒤, 유저의 lineitem 반환
    // data를 찾을 때는 orderId를 이용, orderId는 사용자가 장바구니에 아이탬을 담았을 때 해당 아이탬이 가리키는 basket을 의미함
    // LineItem 지우기는 회원만 가능
    return jwt.verify(token, 'salt', async (err, decoded) => {
      await LineItem.destroy({
        where: {
          userId: decoded.id,
          name: body.name
        }
      })
  
      return 'deleted'
    })
  }

  async addReview(token, body) {
    // body.contacts의 length 만큼 반복
    return jwt.verify(token, 'salt', async (err, decoded) => {
      await body.contacts.forEach(async contact => {
        await Review.findOrCreate({
          where: {
            userId: decoded.id,
            itemId: contact.itemId,
            rate: body.rate, // 0.2 ~ 1.0 현재 rate column이 정수로만 저장되고 있음 문제가 뭘까??
            text: body.text,
            name: contact.name,
            buyOption: contact.buyOption,
            buyCount: contact.buyCount
          }
        })
        // 리뷰의 별점을 아이탬에 적용해줘야 함
        const reviewsForRate = await Review.findAll({
          where: {
            itemId: contact.itemId,
          }
        })
        // 합
        console.log(reviewsForRate.length)
        const sumRate = reviewsForRate.reduce((x, y) => {
          console.log(y);
          console.log(y.dataValues.rate)
          // y.dataValues.rate = 0.2, 0.4, 0.6, 0.8, 1

          return x + y.dataValues.rate
        }, 0)
        console.log(sumRate);
        const result = sumRate / reviewsForRate.length;
        console.log(result)
        await Item.update({
          rate: (result * 10) / 2,
        }, {
          where: {
            id: contact.itemId
          }
        })
      })

  
      return '성공적으로 리뷰가 생성되었습니다'
    })
  }

  async getTag() {
    const tagList = await Tag.findAll();
    return tagList
  }

  async getAllTag() {
    const allTag = await statisticTag.findAll()
    return allTag;
  }

  async createItem(token, body) {
    console.log('~~~~~~~~~~~~~~~~~~~~~~');
    console.log(body);
    return jwt.verify(token, 'salt', async (err, decoded) => {

      if (decoded.id === 2) {
        const result = await Item.findOrCreate({
          where: {
            name: body.name,
            price: body.price*1
          }
        })

        return result;
      }
    })
  }

  async getStatistics(token) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      // 관리자 통계 페이지에서 뿌려줄 통계들을 가공해 뿌려줘야 합니다
      // 1. 총수익: orders에 있는 total을 모두 더해준다.
      const statisticTotal = await Order.sum('total');

      // 2. 최고평점: items에 있는 item rate가 가장 높은 item
      const statisticRate = await Item.max('rate')

      // 3. 최다판매: items에 있는 item count가 가장 높은 item
      const statisticSale = await Item.max('count')

      // 4. 태그별 판매횟수: 
      const statisticTagSale = await statisticTag.findAll({
        attributes: [['tag', 'label'], ['count', 'value']]
      }
      )

      // 5. 소비자 티어분포도
      // let tierArr = new Array(9).fill(1);
      let tierArr = [
        {
          label: 'Iron',
          value: 1
        },
        {
          label: 'Bronze',
          value: 1
        },
        {
          label: 'Silver',
          value: 1
        },
        {
          label: 'Gold',
          value: 1
        },
        {
          label: 'Platinum',
          value: 1
        },
        {
          label: 'Diamond',
          value: 1
        },
        {
          label: 'Master',
          value: 1
        },
        {
          label: 'GrandMaster',
          value: 1
        },
        {
          label: 'Challenger',
          value: 1
        },
      ];
      const statisticTier = await User.findAll()

      statisticTier.forEach(el => {
        const userTier = el.dataValues.tier;
        console.log(userTier);
        if (userTier === 'Iron') {
          tierArr[0].value = tierArr[0].value + 1
        }
        else if (userTier === 'Bronze') {
          tierArr[1].value = tierArr[1].value + 1
        }
        else if (userTier === 'Silver') {
          tierArr[2].value = tierArr[2].value + 1

        }
        else if (userTier === 'Gold') {
          tierArr[3].value = tierArr[3].value + 1

        }
        else if (userTier === 'Platinum') {
          tierArr[4].value = tierArr[4].value + 1

        }
        else if (userTier === 'Diamond') {
          tierArr[5].value = tierArr[5].value + 1

        }
        else if (userTier === 'Master') {
          tierArr[6].value = tierArr[6].value + 1

        }
        else if (userTier === 'GrandMaster') {
          tierArr[7].value = tierArr[7].value + 1

        }
        else if (userTier === 'Challenger') {
          tierArr[8].value = tierArr[8].value + 1

        }
      });

      return {
        statisticTotal,
        statisticRate,
        statisticSale,
        statisticTagSale,
        tierArr
      }
    })
  }

  async addSearch(token, body) {
    // count column이 존재할 때,
    // 장점: 같은 유저가 같은 검색어를 검색할 때, 불필요한 데이터 개수를 늘리지 않을 수 있다
    // 단점: 코드 길이가 늘어난다??
    return jwt.verify(token, 'salt', async (err, decoded) => {
      const checked = await Search.findOne({
        where: {
          userId: decoded.id,
          keyword: body.keyword
        }
      })

      if (!checked) {
        const createKeyword = await Search.create({
          userId: decoded.id,
          keyword: body.keyword
        })
  
        return createKeyword 
      } else {
        const addCountKeyword = await Search.increment(
          {
            count: + 1,
          },
          {
            where: {
              userId: decoded.id,
              keyword: body.keyword
            }
          }
        )

        return addCountKeyword;
      }
    })
  }

  async getKeywordRate() {
    const keywordRate = await Search.findAll({
      order: [
        ['count', 'DESC']
      ]
    })
    // 다 가져와서 정렬한 후 리턴 or 정렬한 것을 가져와서 리턴
    return keywordRate;
  }

  async addFilterTag(token, body) {
    // 데이터 양이 많아지면 해당 테이블 구조는 문제가 생길 수??
    return jwt.verify(token, 'salt', async (err, decoded) => {
      const checked = await FilterTag.findOne({
        where: {
          userId: decoded.id,
          tag: body.tag
        }
      })

      if (!checked) {
        await FilterTag.create({
          userId: decoded.id,
          tag: body.tag
        })
        return 'create'
      } else {
        await FilterTag.destroy({
          where: {
            userId: decoded.id,
            tag: body.tag
          }
        })
        return 'delete'
      }

    })
  }

  async getFilterTag(token) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      const filters = await FilterTag.findAll({
        where: {
          userId: decoded.id
        },
        attributes: ['tag']
      })

      // ['스킨', '챔피언']의 형태로
      return filters
    })
  }

  async addBell(token, body) {
    return jwt.verify(token, 'salt', async(err,decoded) => {
      const createBell = await Bell.create({
        userId: 2,
        text: body.text
      })
      return createBell
    })
  }

  async getBell(token) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      const bellList = await Bell.findAll({
        where: {
          userId: decoded.id,
          // read: {
          //   [Op.ne]: true
          // }
        }
      })
      // userId로 된 bell을 모두 가져온다.
      // read가 false인 레코드만 가져온다.
      // 다 가져와서 클라에서 핗터
      // false인 배열 = bellBadge
      // 전체 배열 = bells

      return bellList;
    })
  }

  async clearBellBedge(token) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      await Bell.update({
        read: true
      },
      {
        where: {
          userId: decoded.id
        }
      })
      return 'done clear bell'
    })
  }

  async addOption(token, body) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      // 가장 최근 추가된 아이탬에 추가하는 로직..
      // api 호출은 아이탬이 생성되었을 때만 되어야 함!
      // body는 arr
      const items = await Item.findAll();

      console.log(body);
      console.log(items.length);
      body.option.forEach(async opt => {
        await Option.create({
          itemId: items.length,
          option: opt.option,
          optionPrice: opt.price
        })
      })
      // await Option.create({
      //   itemId: items.length - 1,
      // })

      return 'done update option'
    })
  }

  async addTag(token, body) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      const items = await Item.findAll();
      
      body.tag.forEach(async tag => {
        await Tag.findOrCreate({
          where: {
            itemId: items.length,
            tag: tag,
          }
        })
      })
      return;
    })
  }

  async getRp(token, body) {
    // rp 충전에 대한 요청과 결제수단에 대한 요청을 받아서 결제 및 충전 과정을 해결한다.
    return jwt.verify(token, 'salt', async (err, decoded) => {
      // 결제 코드
      // 충전 코드
      console.log(body);
      await User.increment({
        rp: +body.selectRp
      }, {
        where: {
          id: decoded.id
        }
      })

      return 'done rp'
    })
  }

  async addOrderNow(token, body) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      console.log(body);
      const userRp = await User.findOne({
        where: {
          id: decoded.id
        },
        attributes: ['rp']
      })

      if (userRp.dataValues.rp < body.total) {
        console.log('!!!!!!!!!!!!!!!!!!!!')
        throw new Error('잔액이 부족합니다')
      } else {
        // rp 차감
        await User.increment({
          rp: -body.total
        }, {
          where: {
            id: decoded.id
          }
        })

        const orderInfo = await Order.create({
          userId: decoded.id,
          total: body.total
        })

        await LineItem.create({
          name: body.name,
          img: body.img,
          itemId: body.itemId,
          lineTotal: body.lineTotal,
          userId: decoded.id,
          buyOption: body.buyOption,
          buyCount: body.buyCount
        })

        await LineItem.update({
          // 생성된 오더 아이디가 들어가야 됨
          orderId: orderInfo.dataValues.id,
        }, {
          where: {
            userId: decoded.id,
            orderId: null
          }
        })

        await Item.increment({
          count: +1,
        }, {
          where: {
            id: body.itemId
          }
        })
        // statisticTag table에 해당 아이탬의 태그가 들어가야함
        // 태그 어떻게 가져올 것인가??
        // 방금 생성한 오더 아이디를 통해서 유저가 구매한 아이탬리스트를 가져올 수 있음

        const buyItems = await LineItem.findAll({
          where: {
            orderId: orderInfo.dataValues.id,
          },
          include: {
            model: Item,
            attributes: ['id']
          }
        })

        console.log(buyItems)

        // 해당 아이템 리스트와 include 옵션으로 쿼리를 보내서 tag를 구한다음 해당 statisticTag에 추가
        // buyItems 개수만큼 반복
  
        // buyItems.forEach(async (buyItem) => {
        //   // 아이탬 아이디를 바탕으로 tag table에 요청을 보내서 tag들을 받아오고 그걸 바탕으로 또 statisticTag table 넣어줘야한다.
        //   const itemId = buyItem.dataValues.Item.id
  
        //   const tags = await Tag.findAll({
        //     where: {
        //       itemId: itemId,
        //     }
        //   })
  
        //   tags.forEach(async (tag) => {
        //     const tagName = tag.dataValues.tag;
  
        //     await statisticTag.increment(
        //       {
        //         count: + 1,
        //       },
        //       {
        //       where: {
        //         tag: tagName
        //       }
        //     })
        //   })
        // });

        console.log(4)
        await User.increment({
          buyCount: + 1,
        }, 
        {
          where: {
            id: decoded.id
          }
        }
        )
      }
      return 'done buy one'
    })
  }

  async success(query) {
    // const secretKey = 'dGVzdF9za181R2VQV3Z5Sm5yS2JkS05QMVplVmdMek45N0VvOg==';
    const secretKey = 'test_sk_5GePWvyJnrKbdKNP1ZeVgLzN97Eo:';
    if (true) {
      axios.post(`https://api.tosspayments.com/v1/payments/${query.paymentKey}`, {
        "orderId": query.orderId,
        "amount": query.amount
      }, {
        headers: {
          // Authorization: `Basic ${secretKey}`,
          Authorization: `Basic ` + Buffer.from(secretKey + ":").toString("base64"),
          "Content-type": "application/json",
        }
      })
      .then((res) => {
        // 결제 끝, 홈으로 사용자를 홈으로 보내줘야 함
        console.log(res);
        if (res.data.status === 'DONE') {
          return '토스 끝!'
        }
      })
    }
  }

  async getLineItemForBasket(token) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      const LineItemForBasket = await LineItem.findAll({
        where: {
          userId: decoded.id,
          orderId: null
        }
      })
      return LineItemForBasket
    })
  }

  async configName(token, body) {

    return jwt.verify(token, 'salt', async (err, decoded) => {
    const newName = await User.update({
        name: body.newName,
      }, {
        where: {
          id: decoded.id
        }
      })
      return newName;
    })
  }

  async configPw(token, body) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      // body.password, body.newPassword

      // 현재 패스워드가 올바른지 검사
      const userData = await User.findOne({
        where: {
          id: decoded.id
        }
      })

      const isVerify = await passwordHash.verify(body.password, userData.dataValues.password)

      if (!isVerify) {
        throw new Error('잘못된 비밀번호')
      } else {
        // 맞다면 비밀번호를 업데이트 해줘야 함

        const newPassword = passwordHash.generate(body.newPassword);

        await User.update({
          password: newPassword
        }, {
          where: {
            id: decoded.id
          }
        })

        return '비밀번호 변경 성공'
      }
    })
  }

  async deleteUser(token, body) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      // password 검증
      const userData = await User.findOne({
        where: {
          id: decoded.id
        }
      })

      const isVerify = await passwordHash.verify(body.password, userData.dataValues.password)
      // User 정보 삭제 후 어떤 데이터가 삭제되는지 판단 후 수정
      if (isVerify) {
        await User.destroy({
          where: {
            id: decoded.id
          }
        })
        return '탈퇴 성공'
      } else {
        return '탈퇴 실패'
      }

    })
  }
  
  async deleteItem(token, body) {
    return jwt.verify(token, 'salt', async (err, decoded) => {
      // body 정보와 일치하는 아이탬을 삭제해야됨
      if (decoded.id === 2) {
        await Item.destroy(
        {
          where: {
            id: body.id,
          }
        })
        return '삭제 성공'
      } else {
        return '삭제 실패'
      }

    })
  }
}
