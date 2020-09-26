<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 表单
        </el-breadcrumb-item>
        <el-breadcrumb-item>友情链接</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="model" label-width="100px" class="demo-dynamic" @submit.native.prevent="save">
          <el-form-item label="链接图片">
              <el-upload class="avatar-uploader"
                    :action="$http.defaults.baseURL + '/upload' "
                    :show-file-list="false" 
                    :on-success="afterUpload"
                    :headers="getAuthHeaders()"
                    >
                    <img v-if="model.logoUrl" :src="model.logoUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>

          <el-form-item label="友联类名" title="i  classname名字">
            <el-input v-model="model.iconClassName"></el-input>
          </el-form-item>

          <el-form-item label="友链名称">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="链接地址" >
            <el-input v-model="model.herf"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'baseform',

    inject: ['reload'],
    data() {
      return {
        model: {},
      };
    },
    methods: {
      afterUpload(res, file) {
        this.$set(this.model, 'logoUrl', res.url);
      },

      async save(){
          const res = await this.$http.post('rest/links',this.model);
          this.$router.push('/linklist');
          this.reload();
          this.$message({
             type:'success',
             message:'添加成功'
          })
      }
    },


  }
</script>


<style>
  .avatar-uploader .el-upload {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>