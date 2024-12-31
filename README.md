# Mirai project
เป็นเว็บไซต์สำหรับตรวจสอบสภาพอากาศ โดยใช้งาน API จาก [https://api.openweathermap.org](https://api.openweathermap.org) ในการจัดทำครั้งนี้ใช้เพื่อเรียนรู้การ Cache ข้อมูลจาก API เพื่อประหยัดจำนวนการเรียกใช้งาน API โดย API จาก [https://api.openweathermap.org](https://api.openweathermap.org) มีโควตาให้ 1000 ครั้งต่อหนึ่งเดือน
# วิธีติดตั้งและใช้งาน Mirai project
```cmd
git clone https://github.com/NatchaLatte/mirai-project.git
cd mirai-project
```
### ติดตั้ง JavaScript runtime environment คือ `Node.js` จากลิงก์ [https://nodejs.org/en](https://nodejs.org/en)
### ติดตั้ง Package `pnpm` ซึ่งเป็น Package manager ด้วยคำสั่งดังนี้
```cmd
npm install -g pnpm
```
### สร้างไฟล์ `server/src/.env`
```.env
OPEN_WEATHER_API_URL=https://api.openweathermap.org
APP_ID_API_KEY={API key}
```
### ติดตั้ง `node_modules` ที่ `mirai-project/server` และเริ่มต้นใช้งาน
```cmd
pnpm install
pnpm dev
```
### สร้างไฟล์ `client/.env.local`
```.env
VITE_API_API_URL={SERVER_HOST:SERVER_PORT}
```
### ติดตั้ง `node_modules` ที่ `mirai-project/client` และเริ่มต้นใช้งาน
```cmd
pnpm install
pnpm dev
```
### เข้าใช้งานเว็บไซต์ตามค่าตั้งต้นด้วยลิงก์ [http://localhost:3000/](http://localhost:3000/)
