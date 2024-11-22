<script setup>

</script>

<template>
    <div class="footer">
        <el-row class="more_services">
            <el-col :span="24">
                <span class="hidden-div">绝地求生作图</span>
                <span >CDK兑换官网</span>
                <span class="hidden-div">全球账号官网</span>
                <span >绝地求生官网</span>
                <span>PUBG自助服务</span>
            </el-col>
        </el-row>
        <el-row justify="space-between" class="website_Information">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <p><a href="https://beian.miit.gov.cn/">闽ICP备2022018088号</a></p>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="Information">
                <p>数据来源于Krafton,Pubg,Steam公司</p>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
    p{
        margin: 0;
        margin-top: 10px;
    }
    .Information p {
        text-align: right;
    }

    .website_Information {
        color: white;
    }

    a {
        color: white;
        text-decoration: none;
    }

    .footer {
        padding: 20px;
        background-color: rgb(43, 43, 43);
    }

    .more_services {
        padding: 5px;
        color: white;
        background-color: rgb(71, 71, 71);
    }

    .more_services span {
        margin-right: 10px;
    }

    @media screen and (max-width: 768px) {
        .Information p {
            text-align: left;
        }

        .footer {
            font-size: 14px;
        }

        .hidden-div {
            display: none;
        }
    }
    @media screen and (max-width: 992px) {
        .Information p {
            text-align: left;
        }
    }
</style>