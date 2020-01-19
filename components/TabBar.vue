<template>
    <view :class="'container' + children[this.state.selectedIndex].props.screenBackgroundColor ?
            children[this.state.selectedIndex].props.screenBackgroundColor :
            '#008080'">
            {children[selectedIndex]}
            <view class="content">
                <view class="subContent">
                    {
                        React.Children.map(children,  (child,i) => {
                            const imgSrc = selectedIndex === i && showIcon ?
                                <view class="circle">
                                    <Icon :name="child.props.selectedIcon" size="30" color="#117893" />
                                </view>
                            :
                            <Icon :name="child.props.icon" size="30" color="#fff" />

                            return (
                                <touchable-opacity
                                    :key="i"
                                    underlayColor='transparent'
                                    :class="'navItem'"
                                    :on-press="() => this.update(i)"
                                >
                                    {imgSrc}
                                </touchable-opacity>
                            );
                        })
                    }

                }

                </view>
                 <Svg version="1.1" id="bottom-bar" x="0px" y="0px" width="100%" height="100" viewBox="0 0 1092 260" space="preserve">
                    <AnimatedPath
                        :fill="bgNavBar ? bgNavBar : '#f0f0f0'"
                        :stroke="stroke ? stroke : '#f0f0f0'"
                        :d="`M30,60h${this.state.pathX}.3c17.2,0,31,14.4,30,31.6c-0.2,2.7-0.3,5.5-0.3,8.2c0,71.2,58.1,129.6,129.4,130c72.1,0.3,130.6-58,130.6-130c0-2.7-0.1-5.4-0.2-8.1C${this.state.pathY}.7,74.5,${this.state.pathA}.5,60,${this.state.pathB}.7,60H1062c16.6,0,30,13.4,30,30v94c0,42-34,76-76,76H76c-42,0-76-34-76-76V90C0,73.4,13.4,60,30,60z`"
                    }/>
                    <AnimatedCircle
                        :ref="ref => this._myCircle = ref"
                        :fill="bgNavBarSelector ? bgNavBarSelector : '#f0f0f0'"
                        :stroke="stroke ? stroke : '#f0f0f0'"
                        cx="211" cy="100"
                        r="100"
                    />
                </Svg>
            </view>
    </view>
</template>
<script>

TabBar.Item = TabBarItem;

export default {
    name: 'TabBar',
    data() {
        return {
            selectedIndex: 0,
            defaultPage: 0,
            navFontSize: 12,
            navTextColor: 'rgb(148, 148, 148)',
            navTextColorSelected: 'rgb(51, 163, 244)',
            circleRadius: new Animated.Value(546),
            pathD: new Animated.Value(357),
            pathX: '22',
            pathY: '675',
            pathA: '689',
            pathB: '706',
            showIcon: true,
        }
    },
    methods: {

    },
    components: {

    }
}
</script>
<style scoped>
    .container {
        flex: 1;
        overflow: 'hidden';
    };
    .content {
        flex-direction:'column';
        z-index: 0;
        width: 100;
        margin-bottom: '1%';
        left: '4%';
        right: '4%';
        position: 'absolute';
        bottom: '1%';
    };
    .subContent {
        flex-direction: 'row';
        margin-left: 15;
        margin-right: 15;
        margin-bottom: 15;
        z-index: 1;
        position: 'absolute';
        bottom: 5;
    };
    .navItem {
        flex: 1;
        padding-top: 6;
        padding-bottom: 6;
        align-items: 'center';
        z-index: 0;
    };
    .navImage {
        width: 45;
        height: 45;
    };
    .circle {
        bottom: 18;
    };
</style>