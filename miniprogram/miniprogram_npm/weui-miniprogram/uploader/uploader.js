var globalThis=this,self=this;module.exports=require("../_commons/0.js")([{ids:[22],modules:{162:function(e,t){Component({options:{},properties:{title:{type:String,value:"图片上传"},sizeType:{type:Array,value:["original","compressed"]},sourceType:{type:Array,value:["album","camera"]},maxSize:{type:Number,value:5242880},maxCount:{type:Number,value:1},files:{type:Array,value:[],observer:function(e){this.setData({currentFiles:e})}},select:{type:null,value:function(){}},upload:{type:null,value:null},tips:{type:String,value:""},extClass:{type:String,value:""},showDelete:{type:Boolean,value:!0}},data:{currentFiles:[],showPreview:!1,previewImageUrls:[]},ready:function(){},methods:{previewImage:function(e){var t=e.currentTarget.dataset.index,a=[];this.data.files.forEach((function(e){a.push(e.url)})),this.setData({previewImageUrls:a,previewCurrent:t,showPreview:!0})},chooseImage:function(){var e=this;this.uploading||wx.chooseImage({count:this.data.maxCount-this.data.files.length,sizeType:this.data.sizeType,sourceType:this.data.sourceType,success:function(t){console.log("chooseImage resp",t);var a=-1;if((t.tempFiles.forEach((function(t,i){t.size>e.data.maxSize&&(a=i)})),console.log("this.data.select: ".concat(e.data.select)),"function"==typeof e.data.select)&&!1===e.data.select(t))return;if(a>=0)e.triggerEvent("fail",{type:1,errMsg:"chooseImage:fail size exceed ".concat(e.data.maxSize),total:t.tempFilePaths.length,index:a},{});else{var i=wx.getFileSystemManager(),s=t.tempFilePaths.map((function(e){return i.readFileSync(e)})),l={tempFilePaths:t.tempFilePaths,tempFiles:t.tempFiles,contents:s};e.triggerEvent("select",l,{});var r=t.tempFilePaths.map((function(e,a){return{loading:!0,url:t.tempFilePaths[a]||"data:image/jpg;base64,".concat(wx.arrayBufferToBase64(s[a]))}}));if(r&&r.length&&"function"==typeof e.data.upload){var n=e.data.files.length,o=e.data.files.concat(r);e.setData({files:o,currentFiles:o}),e.loading=!0,e.data.upload(l).then((function(t){if(console.log("------",t),e.loading=!1,t.urls){var a=e.data.files;t.urls.forEach((function(e,t){a[n+t].url=e,a[n+t].loading=!1})),e.setData({files:a,currentFiles:o}),e.triggerEvent("success",t,{})}else e.triggerEvent("fail",{type:3,errMsg:"upload file fail, urls not found"},{})})).catch((function(a){console.log("------catch",a),e.loading=!1;var i=e.data.files;t.tempFilePaths.forEach((function(e,t){i[n+t].error=!0,i[n+t].loading=!1})),e.setData({files:i,currentFiles:o}),e.triggerEvent("fail",{type:3,errMsg:"upload file fail",error:a},{})}))}}},fail:function(t){t.errMsg.indexOf("chooseImage:fail cancel")>=0?e.triggerEvent("cancel",{},{}):(t.type=2,e.triggerEvent("fail",t,{}))}})},deletePic:function(e){var t=e.detail.index,a=this.data.files,i=a.splice(t,1);this.setData({files:a,currentFiles:a}),this.triggerEvent("delete",{index:t,item:i[0]})}}})},17:function(e,t,a){e.exports=a(162)}},entries:[[17,0]]}]);