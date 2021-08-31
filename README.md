# AutoPack
使用electron-vue模板搭建的文件打包工具。
拖拽项目至该工具后，自动将源文件和可执行文件分别进行压缩打包备份。同时将旧版本的可执行文件重命名，增加时间戳。

# 环境 
* **Node 14.17.5**
* **npm 6.14.14**

# 运行
* **1.npm install**
* **2.npm run dev**

# 构建
## 一：打包成文件夹及绿色免安装
* **1.npm run build:clean**
* **2.npm run build:dir**

注意：

build过程中，若winCodeSign依赖包无法下载导致构建失败。解决方法如下：
* 1.打开链接: https://github.com/electron-userland/electron-builder-binaries/releases
* 2.选择对应版本的Source code (zip)下载并解压，里面已经包含nsis
* 3.windows系统下，在%LOCALAPPDATA%（C:\Users\Administrator\AppData\Local）目录下新建electron-builder\cache\ 文件夹
* 4.将第二步Source code (zip)解压后的所有文件，拷贝至cache目录下
* 5.进入/cache/winCodeSign目录，将winCodeSign-x.x.x 文件夹名称修改为对应版本的名称（例如：winCodeSign-2.6.0）
* 6.至此，npm run build:dir 应该可以了。

![目录结构](./imgs/dir.jpg)

## 二：打包成exe的安装包
* **1.npm run build:clean**
* **2.npm run build**

注意：

build过程中，若nsis、nsis-resources等依赖包无法下载导致构建失败。解决方法如下：
* 1.根据失败的下载链接，手动进行下载，并将内容替换到对应的目录。
* 2.更改替换后的文件件名称。将/cache/nsis文件夹 修改为nsis-3.0.4.1。/cache/nsis-resources文件夹修改为nsis-resources-3.4.1。
* 3.最终目录结构如下：至此，应该可以build成功了。

![目录结构](./imgs/build1.jpg)

![目录结构](./imgs/build2.jpg)


# Node版本引起的常见问题
[解决方法](https://github.com/SimulatedGREG/electron-vue/issues/871)

# 界面预览
![界面预览](./imgs/AutoPack.jpg)
