// componets/image-picker/image-picker.js

const STATUS_WAIT = 1;
const STATUS_UPLOADING = 2;
const STATUS_FAILED = 3;
const STATUS_SUCCESS = 4;
const STATUS_CANCEL = 5;

// 上传完成事件
const EVENT_UPLOAD_COMPLETED = 'uploadCompleted';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 服务器路径
     */
    url: {
      type: String,
      value: null,
    },

    /* 最多可以添加的图片数 */
    count: {
      type: Number,
      value: 9,
    },

    /* 所选的图片的尺寸 */
    sizeType: {
      type: Array,
      value: ['original', 'compressed']
    },

    /* 选择图片的来源 */
    sourceType: {
      type: Array,
      value: ['album', 'camera']
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    images: [], //图片数据[id,name,url,size,status],
    queueIndex: -1, //当前队列
    isUploading: false, //是否上传中
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * picker 选择图片
     */
    onPicker: function() {
      const _this = this;
      wx.chooseImage({
        count: this.properties['count'] - this.data.images.length, //设置可获取的最多图片数
        sizeType: this.properties['sizeType'],
        sourceType: this.properties['sourceType'],
        success: function(res) {
          const files = res.tempFiles;
          files.forEach(function(value, index, array) {
            _this.addImage(value.path, value.size);
          });
          //_this.nextQueue();
        },
      })
    },

    /**
     * 添加
     */
    addImage: function(id, size) {
      const images = this.data.images;
      let image = {
        id: id,
        url: null, //服务器路径
        size: size, //大小字节
        status: STATUS_WAIT, //1等待上传，2上传中，3上传出错，4上传完成
        progress: 0,
        msg: null
      }
      images.push(image);
      this.setData({
        images: images
      });
    },
    /**
     * 删除
     */
    removeImage: function(index) {
      const images = this.data.images;
      this.cancelUpload(images[index]);
      images.splice(index, 1);
      this.setData({
        images: images
      });
    },

    /**
     * 更新
     */
    updateImage: function(image) {
      var index = this.data.images.indexOf(image);
      console.log(index, this.data.images[index].status);
      var key = 'images[' + index + ']';
      this.setData({
        key: image
      });
      this.setData({
        images: this.data.images
      });
    },

    /**
     * 队列，下一个
     */
    nextQueue: function() {
      if (this.data.isUploading) {
        return;
      }
      const images = this.data.images;
      let queueIndex = this.data.queueIndex,
        max = images.length;

      if (queueIndex == max - 1) {
        //上传完成
        console.log('上传完成！');
      } else {
        queueIndex++;
        this.uploadFile(images[queueIndex]);
        this.setData({
          queueIndex: queueIndex,
          isUploading: true,
        });
      }
    },


    /**
     * 上传文件
     */
    uploadFile: function(image) {
      if (image.status == STATUS_UPLOADING || image.status == STATUS_SUCCESS) {
        return;
      }
      const _this = this;
      const uploader = {
        /* 进度侦听 */
        onProgressUpdateCallBack: (res) => {
          image.progress = res.progress;
          _this.updateImage(image);
        },
      };
      /** 上传 */
      const task = wx.uploadFile({
        url: this.properties['url'],
        filePath: image.id,
        name: 'file',
        success: (res) => {
          const data = JSON.parse(res.data)
          image.url = data.data['url'];
          image.status = STATUS_SUCCESS;
          _this.data.isUploading = false;
          _this.updateImage(image);
          _this.nextQueue();
        },
        fail: (e) => {
          image.status = STATUS_FAILED;
          _this.data.isUploading = false;
          _this.updateImage(image);
          _this.nextQueue();
        }
      });


      /** 上传进度 */
      task.onProgressUpdate(uploader['onProgressUpdateCallBack']);
      uploader['task'] = task;
      image['uploader'] = uploader;
      image['status'] = STATUS_UPLOADING;
      _this.updateImage(image);
    },

    /**
     * 取消上传任务
     */
    cancelUpload: function(image) {
      const _this = this;
      const uploader = image['uploader'];
      const task = uploader.task;
      task.offProgressUpdate(uploader.onProgressUpdateCallBack);
      task.abort();
      image.status = STATUS_CANCEL;
      _this.updateImage(image);
    },
  }
})