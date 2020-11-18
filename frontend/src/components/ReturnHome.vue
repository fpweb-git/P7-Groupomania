<template>
    <div class="return">
    <router-link to="/">
    <i class="el-icon-arrow-left return__icon"></i>
    <span class="return__text">Retour</span>
    </router-link>
    </div>    
</template>

<style lang="scss" scoped>
.return{
    padding: 1.8rem 0 0 1.8rem;
    display: flex;
    align-items: center;
    &__icon{
        font-size: 1rem;
    }
    &__text{
        margin-left: 0.2rem;
    }
}
</style>