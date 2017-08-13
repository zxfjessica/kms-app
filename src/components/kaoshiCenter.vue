<template>
	<div class="container kaoshi-center">
        <!-- content start -->
        <section class="box-section">
            <h1>{{examInfos.examName}}</h1>
            <div class="exam-infos">
                <p class="exam-list exam-score signs2 clearfix">试题总分：
                    <span class="fr"><i>{{examInfos.totalScore}}</i>分</span>
                </p>
                <p class="exam-list exam-long signs2 clearfix">答题时间：
                    <span class="fr"><i>{{examInfos.longTime}}</i>分钟</span>
                </p>
                <p class="exam-list exam-times signs2 clearfix">考试次数：
                    <span class="fr">共<i>{{examInfos.tryCount}}</i>次，已考<i>{{examInfos.empTryCount}}</i>次</span>
                </p>
            </div>
            <div class="exam-tips">
                <span>温馨提示：</span>
                <p>开考后，请勿关闭应用程序或切屏，否则将会自动提交试卷。</p>
            </div>
        </section>

        <footer>
            <a class="kaishikaoshi" @click="startExam">
                <div>开始考试</div>
            </a>
        </footer>
	</div>
</template>
<script type="text/javascript">
    export default{
        name: 'kaoshiCenter',
        props: [
            "examId",
            "examInfos"
        ],
        data(){
            return {
            }
        },
        mounted(){
        },
        methods:{
            startExam : function(){
               this.$emit('startExam');
            }
        }
    }
</script>
<style lang="less">
.kaoshi-center{
    font-size: 12px;
    top: 0 !important;
    z-index: 1000;
    section{
        background-color: #fff;
        h1{
            padding: 10% 3.6%;
            font-size: .56rem;;
            text-align: center;
        }
        .exam-infos{
            padding: 0 3.6%;
            .exam-list{
                font-size: 0.45rem;
                line-height: 1.35rem;
                border-bottom: 1px solid #e6e6e6;
                span{
                    font-size: 0.35rem;
                    color: #999;
                    i{
                        color: #ff4141;
                    }
                }
            }
            .exam-score:before{
                background-position: 0 2px;
                top: 0.35rem;
            }
            .exam-long:before{
                background-position: 0 -44px;
                top: 0.35rem;
            }
            .exam-times:before{
                background-position: 0 -69px;
                top: 0.35rem;
            }
        }
        .exam-tips{
            padding: 8% 3.6%;
            span{
                font-size: 0.44rem;
            }
            p{
                margin-top: 8px;
                color: #999;
            }
        }
    }
    footer{
        border: none;
        .kaishikaoshi{
            display: block;
            width: 100%;
            div{
                width: 100%;
                line-height: 50px;
                background-color: #ff4141;
                color: #fff;
                font-size: 0.52rem;
            }
        }
        
    }
}
.kaoshi-center, .kaoshi-datiye, .survey-container-one{
    position: relative;
    .box-section{
        height: 100%;
        overflow-y: auto;
    }
    footer{
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        max-height: 50px;
    }
}


</style>