import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

import {FileInterceptor} from '@nestjs/platform-express';
// import { JwtService } from '@nestjs/jwt';

// interface는 들어오는 객체 프로퍼티의 타입을 지정하고 검사가 가능하게 한다
interface Message {
  message: string,
}

@Controller() // base url
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/add-line-item')
  addLineItem(@Body() body): object{
    return this.appService.addLineItem(body);
  }

  @Post('add-dib')
  async addDib(@Body() body, @Req() req: Request) {
    // const jwt = await req.headers.authorization.split('Bearer ')[1]
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.addDib(jwt, body);
  }

  @Post('/order')
  async addOrder(@Body() body, @Req() req: Request) {
    if (req.headers.authorization) {
      const jwt = await req.headers.authorization.split('Bearer ')[1]
      return this.appService.addOrder(jwt, body);
    }
    return this.appService.addOrder(null, body);
  }

  @Post('/order-now')
  async addOrderNow(@Body() body, @Req() req: Request) {
    console.log(req);

    const jwt = req.headers.authorization.split('Bearer ')[1]
    
    return this.appService.addOrderNow(jwt, body);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/get-tag')
  getTag() {
    return this.appService.getTag();
  }

  @Get('/basket')
  getLineItem() {
    return this.appService.getLineItem();
  }

  @Post('/signup')
  signUp(@Body() body) {
    return this.appService.signUp(body);
  }

  @Post('/signin')
  signIn(@Body() body) {
    return this.appService.signIn(body);
  }

  @Post('/get-item-info')
  async getItemInfo(@Body() body, @Req() req:Request): Promise<any> {
    if (req.headers.authorization) {
      const jwt = await req.headers.authorization.split('Bearer ')[1];
      return this.appService.getItemInfo(jwt, body);
    } else {
      return this.appService.getItemInfo(undefined, body);
    }
  }

  @Post('/out-basket')
  async deleteLineItem(@Body() body, @Req() req:Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.deleteLineItem(jwt, body)
  }

  @Post('/add-review')
  async addReview(@Body() body, @Req() req:Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.addReview(jwt, body);
  }

  @Post('/create-item')
  async createItem(@Body() body, @Req() req:Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.createItem(jwt, body);
  }

  @Post('/search')
  async addSearch(@Body() body, @Req() req:Request) {
    const jwt = await  req.headers.authorization.split('Bearer ')[1]
    return this.appService.addSearch(jwt, body)
  }

  @Post('/add-filter-tag')
  async addFilterTag(@Body() body, @Req() req:Request) {
    const jwt = await  req.headers.authorization.split('Bearer ')[1]
    return this.appService.addFilterTag(jwt, body);
  }

  @Post('/add-bell')
  async addBell(@Req() req:Request, @Body() body) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.addBell(jwt, body);
  }

  @Post('/add-option')
  async addOption(@Req() req:Request, @Body() body) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.addOption(jwt, body);
  }

  @Post('/add-tag')
  async addTag(@Req() req:Request, @Body() body) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.addTag(jwt, body);
  }

  @Post('/pay')
  async getRp(@Req() req:Request, @Body() body) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.getRp(jwt, body)
  }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  @Get('/get-bell')
  async getBell(@Req() req:Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.getBell(jwt)
  }

  @Get('/contacts')
  async getContacts(@Req() req: Request): Promise<any>{
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    console.log(this.appService.getContacts(jwt));
    return this.appService.getContacts(jwt);
  }

  @Get('/list-orders')
  async getListOrders(@Req() req: Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.getListOrders(jwt);
  }

  @Get('/get-item-list')
  async getItemList() {
    return this.appService.getItemList();
  }

  @Get('/dibs')
  async getDibList(@Req() req: Request){
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.getDibList(jwt);
  }

  @Get('/user-info')
  async getUserInfo(@Req() req: Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.getUserInfo(jwt);
  }

  @Get('/statistics')
  async getStatistics(@Req() req: Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.getStatistics(jwt);
  }

  @Get('/get-keyword-rate')
  async getKeywordRate() {
    return this.appService.getKeywordRate();
  }

  @Get('/get-all-tag')
  async getAllTag() {
    return this.appService.getAllTag();
  }

  @Get('/get-filter-tag')
  async getFilterTag(@Req() req:Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.getFilterTag(jwt);
  }

  @Get('/clear-bell-bedge')
  async clearBellBedge(@Req() req:Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.clearBellBedge(jwt);
  }

  @Get('/success')
  async success(@Req() req:Request, @Query() query) {
    return this.appService.success(query);
  }

  @Get('/get-line-item')
  async getLineItemForBasket(@Req() req:Request) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.getLineItemForBasket(jwt);
  }

  @Post('/config-name')
  async configName(@Req() req:Request, @Body() body) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.configName(jwt, body);
  }

  @Post('/config-pw')
  async configPw(@Req() req:Request, @Body() body) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.configPw(jwt, body);
  }

  @Post('/delete-user')
  async deleteUser(@Req() req:Request, @Body() body) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.deleteUser(jwt, body);
  }

  @Post('/delete-item')
  async deleteItem(@Req() req:Request, @Body() body) {
    const jwt = await req.headers.authorization.split('Bearer ')[1]
    return this.appService.deleteItem(jwt, body);
  }

}
