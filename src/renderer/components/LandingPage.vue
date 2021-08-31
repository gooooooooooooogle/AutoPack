<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <main>
      <div id="holder" class="holder">
        <b><label>拖拽文件至此</label></b>
      </div>
      <div class="doc" style="text-align: center">
        <button id="btn" @click="packSource">{{btnMsg}}</button>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";

const zipper = require("zip-local");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
let join = require("path").join;

export default {
  name: "landing-page",
  data() {
    return {
      inputDir: "",
      outputDir: "",
      targetName: "",
      fileNameList: [],
      lastedTime: 0,
      oldPathStr: "",
      newPathStr: "",
      newFileName: "",
      files: [],
      projectName: "",
      timestamp: "",
      btnMsg: "开始打包"
    };
  },
  created() {},
  mounted() {
    var holder = document.getElementById("holder");
    // var btn = document.getElementById("btn");
    // console.log(holder);
    var that = this;
    holder.addEventListener(
      "dragover",
      e => {
        e.preventDefault();
      },
      false
    );

    holder.addEventListener(
      "drop",
      e => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files) {
          // console.log("path", files[0].path);
          var str = files[0].path;
          var index = str.lastIndexOf("\\");
          that.projectName = str.substring(index + 1, str.length);
          console.log("项目名称：", that.projectName);
          holder.innerText = str;
          that.btnMsg = "开始打包";
          that.inputDir = str;
          that.outputDir = str;
          console.log("输入目录：", that.inputDir);
          console.log("输出目录：", that.outputDir);
          that.lastedTime = 0;
          console.log("重置标志完成！");
        }
      },
      false
    );
  },
  components: { SystemInformation },
  methods: {
    getFileName(inputPath) {
      let files = fs.readdirSync(inputPath);
      var that = this;
      files.forEach((val, index) => {
        let fPath = join(inputPath, val);
        let stats = fs.statSync(fPath);
        if (stats.isDirectory()) {
          that.getFileName(fPath);
        } else if (stats.isFile()) {
          if (path.extname(val) === ".exe") {
            if (that.lastedTime == 0) {
              that.lastedTime = stats.mtime;
              that.targetName = val;
              that.oldPathStr = fPath;
            } else if (that.lastedTime < stats.mtime) {
              that.lastedTime = stats.mtime;
              that.targetName = val;
              that.oldPathStr = fPath;
            }
          }
        }
      });
      console.log("目标EXE名称：", that.targetName);
      console.log("目标EXE原始路径：", that.oldPathStr);
    },
    modifyFileName() {
      // 获取最新的文件名称以及路径
      this.getFileName(this.inputDir);
      var date = new Date(this.lastedTime);
      const current_time = moment(date).format("YYYY.MM.DD.HHmm");
      this.timestamp = current_time;
      this.newFileName =
        path.basename(this.targetName, ".exe") +
        "-" +
        current_time +
        path.extname(this.targetName);
      this.newPathStr = path.dirname(this.oldPathStr) + "\\" + this.newFileName;

      console.log("目标EXE变更后名称：" + this.newFileName);
      // console.log("oldPathStr：" + this.oldPathStr);
      // console.log("newPathStr" + this.newPathStr);
      fs.renameSync(this.oldPathStr, this.newPathStr);
    },

    packEXE() {
      // 打包EXE
      zipper.sync
        .zip(this.newPathStr)
        .compress()
        .save(
          this.outputDir +
            "\\" +
            this.projectName +
            "(EXE) " +
            this.timestamp +
            // path.basename(this.newFileName, ".exe") +
            ".zip"
        );
    },
    packSource() {
      if (this.lastedTime != 0 || this.inputDir == "") {
        this.$Message["info"]({
          background: true,
          content: "请选择要打包的文件!"
        });
        return;
      }
      // var btn = document.getElementById("btn");
      // btn.innerHTML = "正在打包，请稍等......";
      this.btnMsg = "正在打包，请稍等......";

      setTimeout(() => {
        // 修改最新修改的文件名称，增加时间戳
        this.modifyFileName();
        // 打包
        zipper.sync
          .zip(this.inputDir)
          .compress()
          .save(
            this.outputDir +
              "\\" +
              this.projectName +
              "(源码) " +
              this.timestamp +
              // path.basename(this.newFileName, ".exe") +
              ".zip"
          );

        this.packEXE();

        this.lastedTime = 0;
        // btn.innerHTML = "开始打包";
        this.btnMsg = "开始打包";
        this.$Message["success"]({
          background: true,
          content: "打包完成！"
        });
      }, 100);
    }
  }
};
</script>

<style>
/* @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro'); */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

/* main {
  display: flex; 
  justify-content: space-between;
} */

/* main > div {
  flex-basis: 50%;
} */

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  margin-top: 10px;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}

.holder {
  width: 100%;
  line-height: 200px;
  text-align: center;
  min-height: 140px;
  background: #eee;
  /* margin: 2em; */
  padding: 1em;
  border: 0px dotted #eee;
  border-radius: 10px;
  transition: 0.3s all ease-in-out;
}
.holder-ondrag {
  border: 20px dotted #d45700;
}
</style>
