<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 表单
        </el-breadcrumb-item>
        <el-breadcrumb-item>添加项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="model" label-width="100px" class="demo-dynamic" @submit.native.prevent="save">

            <el-form-item label="项目名称" >
                <el-input placeholder="请输入项目名称" v-model="model.name"></el-input>
            </el-form-item>

            <el-form-item label="项目地址" >
                <el-input placeholder="请输入项目地址" v-model="model.href">
                    <template slot="prepend">http://</template>
                </el-input>
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
     async save(){
         const res = await this.$http.post('rest/projects',this.model);
         this.reload();
         this.$router.push('/projectlist');
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