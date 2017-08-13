<template>
	<div style="height:100%" :class="{'college': ifCollege}"><!--  :class="{'has-footer':footerVisable}" -->
		<router-view></router-view>
	</div>
</template>

<script>

</script>
<style lang="less">
	.app-container{
		.mint-button{
			margin: 0;
		}
	}
</style>

