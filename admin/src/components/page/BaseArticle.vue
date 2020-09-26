<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单 
                </el-breadcrumb-item>
                <el-breadcrumb-item> {{ id ? '编辑文章' :'添加文章'}}  </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="model" label-width="80px" @submit.native.prevent="save">

                    <el-form-item label="文章标题">
                        <el-input v-model="model.name"></el-input>
                    </el-form-item>

                    <el-form-item label="所属分类">
                        <el-select placeholder="请选择" v-model="model.sorts"  multiple >
                            <el-option v-for="item in sorts" :key="item._id" :label="item.name" :value="item._id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="文章封面">
                        <el-upload class="avatar-uploader" :action="$http.defaults.baseURL + '/upload' "
                            :headers="getAuthHeaders()"
                            :show-file-list="false" :on-success="afterUpload">
                            <img v-if="model.imageUrl" :src="model.imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="文章内容">
                        <quill-editor ref="myTextEditor" v-model="model.content"></quill-editor>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary"  native-type="submit">发布文章</el-button>
                        <el-button @click="goForm()">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>


        </div>
    </div>
</template>

<script>

    // 富文本编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
 
    export default {
        name: 'baseform',
        inject: ['reload'],
        props: {
            id: {}
        },
        data() {
            return {
                model: {
                },
                sorts:[],
                content:'',
            };
        },

        // 富文本组件
        components: {
            quillEditor,
        },

        created() {
            this.fetchSorts();
            this.id &&  this.fetch();
        },

        methods: {
            // 查询分类
            async fetchSorts(){
                const res = await this.$http.get('rest/categories');
                // this.sorts = res.data;
                res.data.forEach((item,index)=>{
                    if(!item.parent){
                        return item;
                    }
                    this.sorts.push(item);
                })
            },

            afterUpload(res) {
                console.log(res);
                this.$set(this.model, 'imageUrl', res.url);
            },

            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            
            // 数据保存
            async save() {
                let res
                if(this.id){
                   res = await this.$http.put(`rest/articles/${this.id}`,this.model);
                }else{
                   res =  await this.$http.post('rest/articles',this.model);
                }
                console.log(res);
                this.$router.push('/tabs');
                this.reload();
                this.$message({
                    type:'success',
                    message:"发布成功"
                })
            },

            // 编辑方法
            async fetch(){
                const res = await this.$http.get(`rest/article/${this.id}`);
                this.model = res.data 
            },

            // 取消
            goForm(){
                this.reload();
                this.$router.push('/tabs');
            },


        },
    };
</script>


<style>
    .form-box {
        width: 1200px;
    }

    .avatar-uploader .el-upload {
        width: 330px;
        height: auto;
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
        width: 330px;
        height: auto;
        display: block;
    }
</style>