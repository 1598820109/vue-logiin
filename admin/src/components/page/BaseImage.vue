<template>
    <div class="image">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 图片 </el-breadcrumb-item>
                <el-breadcrumb-item>添加图片</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="form-box">
              <el-form ref="form" :model="model" label-width="80px" @submit.native.prevent="save">
                        <el-upload
                            :action="$http.defaults.baseURL + '/upload' "
                            :headers="getAuthHeaders()"
                            list-type="picture-card"
                            :show-file-list="false"
                            :on-success="afterUpload"
                            multiple
                        >
                        <img width="100%" v-if="model.imageUrl" :src="model.imageUrl" class="avatar">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-form-item>
                        <el-button type="primary"  native-type="submit">上传</el-button>
                    </el-form-item>
              </el-form>
            </div>
        </div>
    </div>
</template>
<script>
export default {

    inject: ['reload'],

    data() {
        return {
            model: {},
            disabled:false,
            multiple:true
        };
    },

    methods: {
        // 上传成功
        afterUpload(res) {
            console.log(res);
            this.$set(this.model, 'imageUrl', res.url);
        },

        async save(){
            const res = await this.$http.post(`rest/images/`,this.model);
            this.reload();
            this.$router.push('imagelist');
            this.$message({
                type:'success',
                message:'上传成功'
            })
        }
    }
};
</script>
