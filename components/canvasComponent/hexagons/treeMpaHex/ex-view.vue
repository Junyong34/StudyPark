<template>
	<div class="treemap-service-container">
		<div class="title-panel">
			<label class="title">cluster Service Map</label>
			<div class="service-map-legend">
				<div
					class="image-list"
					v-for="(podState, i) in podStateList"
					:key="i"
				>
					<img
						class="hex-event"
						:src="podStateDataList[podState].src"
					/>
					<label class="legend-text">{{ podState }}</label>
				</div>
			</div>
			<div class="hint-legend">
				<img
					:src="
						require('@/assets/svg/views/workload/pod/new/icon_restart_count.svg')
					"
				/>
				<label>n = Restarts Counts</label>
			</div>
		</div>
		<div ref="serviceGroup" class="service-panel"></div>
	</div>
</template>

<style lang="scss" scoped>
.treemap-service-container {
	width: 800px;
	height: 600px;
	@include flex-align($d: column, $j: center, $a: center);
	background-color: #121212;
	padding: 0 25px 25px 25px;
	.title-panel {
		line-height: 50px;
		flex-basis: 50px;
		width: 100%;
		background-color: #121212;
		.hint-legend {
			display: inline-block;
			height: 50px;
			line-height: 60px;
			float: right;
			width: 150px;
			img {
				vertical-align: middle;
			}
		}
		.service-map-legend {
			display: inline-block;
			height: 50px;
			line-height: 60px;
			float: right;
			width: 375px;
			.image-list {
				display: inline-block;
				float: right;
				.hex-event {
					margin-left: 5px;
					width: 20px;
					height: 20px;
					vertical-align: middle;
				}
				.legend-text {
					margin-left: 3px;
					width: 25px;
					opacity: 0.7;
					font-family: Roboto;
					font-size: 12px;
					font-weight: normal;
					font-stretch: normal;
					font-style: normal;
					line-height: normal;
					letter-spacing: normal;
					color: rgba(255, 255, 255, 0.54);
				}
			}
		}
		.title {
			margin-left: 15px;
			font-family: Roboto;
			font-size: 14px;
			font-weight: 500;
			font-stretch: normal;
			font-style: normal;
			line-height: normal;
			letter-spacing: normal;
		}
	}
	.service-panel {
		position: relative;
		flex: 1;
		width: 100%;
		background-color: #121212;
	}
}
</style>

<script>
import { mapGetters } from 'vuex';
import ServiceGroupMap from '@/components/services/serviceMap/serviceMap';
import defaultMixin from '@/mixins/defaultMixin';

export default {
	name: 'ex-view',
	components: {},
	mixins: [defaultMixin],
	inheritAttrs: false,
	props: {
		sample: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			sampleView: '',
			serviceMap: null,
			podStateList: ['Running', 'Pending', 'Failed', 'Succeeded', 'Unknown'],
			podStateDataList: {
				Running: {
					type: 'Pod',
					src: require('@/assets/svg/views/workload/pod/new/pod_running.svg'),
					color: '#4fffbb',
					icon: '',
					count: 0,
					motion: require('@/assets/svg/views/workload/pod/new/pod_running_motion.svg'),
				},
				Pending: {
					type: 'Pod',
					src: require('@/assets/svg/views/workload/pod/new/pod_pending.svg'),
					color: '#ffd759',
					icon: '',
					count: 0,
					motion: require('@/assets/svg/views/workload/pod/new/pod_pending_motion.svg'),
				},
				Failed: {
					type: 'Pod',
					src: require('@/assets/svg/views/workload/pod/new/pod_failed.svg'),
					color: '#ff3d6f',
					icon: require('@/assets/svg/views/workload/pod/new/icon_close.svg'),
					count: 0,
					motion: require('@/assets/svg/views/workload/pod/new/pod_failed_motion.svg'),
				},
				Succeeded: {
					type: 'Pod',
					src: require('@/assets/svg/views/workload/pod/new/pod_succeeded.svg'),
					color: '#45a4ff',
					icon: '',
					count: 0,
					motion: require('@/assets/svg/views/workload/pod/new/pod_succeeded_motion.svg'),
				},
				Unknown: {
					type: 'Pod',
					src: require('@/assets/svg/views/workload/pod/new/pod_unknown.svg'),
					color: '#939393',
					icon: require('@/assets/svg/views/workload/pod/new/icon_unknown.svg'),
					count: 0,
					motion: require('@/assets/svg/views/workload/pod/new/pod_unknown_motion.svg'),
				},
			},
			serviceGroupData: {
				children: [
					{
						name: 'tpcc-main',
						count: 1234,
						children: [
							{
								name: 'mister_a',
								group: 'A',
								value: 5,
								count: 5,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
									{
										id:
											'akcoweo-12%433555',
										restart: 5,
										statues: 'falied',
									},
									{
										id:
											'akcoweo-12%433@#@',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_b',
								group: 'A',
								value: 3,
								count: 3,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_c',
								group: 'C',
								value: 2,
								count: 2,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_d',
								group: 'C',
								value: 3,
								count: 3,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
						],
						colname: 'level2',
					},
					{
						name: 'tpcc-order',
						count: 4323423,
						children: [
							{
								name: 'mister_e',
								group: 'C',
								value: 2,
								count: 2,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_f',
								group: 'A',
								value: 2,
								count: 2,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_g',
								group: 'B',
								value: 2,
								count: 2,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_h',
								group: 'B',
								value: 2,
								count: 2,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_h',
								group: 'B',
								value: 2,
								count: 2,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
						],
						colname: 'level2',
					},
					{
						name: 'tpcc-group',
						count: 10,
						children: [
							{
								name: 'mister_i',
								group: 'B',
								value: 3,
								count: 3,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_j',
								group: 'A',
								value: 4,
								count: 4,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_k',
								group: 'A',
								value: 3,
								count: 3,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_l',
								group: 'D',
								value: 4,
								count: 4,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
									{
										id:
											'akcoweo-12%433',
										restart: 5,
										statues: 'falied',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_m',
								group: 'D',
								value: 2,
								count: 2,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_n',
								group: 'D',
								value: 2,
								count: 2,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
								],
								colname: 'level3',
							},
						],
						colname: 'level2',
					},
					{
						name:
							'tpcc-shotdsal;kfdsdklfjldksjfkdasdasdasdaslsdfjgklsdfjigoudfhioghiujddsadsash',
						count: 10,
						children: [
							{
								name: 'mister_i',
								group: 'B',
								value: 3,
								count: 3,
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
								],
								colname: 'level3',
							},
							{
								name: 'mister_k',
								group: 'A',
								value: 3,
								count: 3,
								colname: 'level3',
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
								],
							},
						],
						colname: 'level2',
					},
					{
						name: 'tpcc-date',
						count: 100,
						children: [
							{
								name: 'mister_i',
								group: 'B',
								value: 3,
								count: 3,
								colname: 'level3',
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
								],
							},
							{
								name: 'mister_n',
								group: 'D',
								value: 2,
								count: 2,
								colname: 'level3',
								list: [
									{
										id: 'edfjsk-12#23',
										restart: 5,
										statues: 'running',
									},
									{
										id: 'dsa3@321-32',
										restart: 5,
										statues: 'pending',
									},
								],
							},
						],
						colname: 'level2',
					},
				],
				name:
					'core/dsakl;jdlkasjdklasjdklasjdklsjaklfhasdjkfghuisdfguifsdhguisdfhguisdfhguisdfhguisdhuighsdiuoghuisdhguisdhguisdhiguhsduigfhisudghuisdhgidasdasdsadsadaskkkkkkkkkkkkkasdkjaskldjklasjdioqsjdioasjdoiajsoisdjiodsajiosadjiodaskld;askl;dkasl;dkl;asdkl;askusdhuighsdfuighuiosdhgfudasdasdasdasdasioshduiogsdhfuisdghuiosdfghuio',
				count: 3234,
			},
		};
	},
	computed: {
		...mapGetters({}),
	},
	watch: {
		getNotification: {
			handler(d) {
				// 로직
			},
		},
	},
	created() {},
	beforeDestroy() {},
	mounted() {
		this.$nextTick(() => {
			const config = {
				dom: this.$refs.serviceGroup,
				hexClickHandler: this.hexClickEvent,
				hexMoveHandler: this.hexMoveEvent,
			};
			this.serviceMap = new ServiceGroupMap(config);
			this.serviceMap.baseScene(this.serviceGroupData);
		});
	},
	destroyed() {},
	methods: {
		hexClickEvent(e, hex) {
			if (hex) {
				hex.drawSelectHex(this.serviceMap.ctxPanel, '#78e960');
				console.log(hex.data.id);
			}
		},
		hexMoveEvent(e) {
			console.log('move');
		},
	},
};
</script>
