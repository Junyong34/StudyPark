import config from "../utils/topologyConfig";
import {Graph, ForceLayout} from "./ngraph";

const dataSet = {
    nodeCnt: 10,
    posX: 500,
    posY: 200,
    topologyData: {
        services: [],
        nodes: [],
        edges: [],
        nodesArray: [],
        edgesArray: [],
        nodesIndex: Object.create(null),
        edgesIndex: Object.create(null),
        inNeighborsIndex: Object.create(null),
        outNeighborsIndex: Object.create(null),
        allNeighborsIndex: Object.create(null),

        inNeighborsCount: Object.create(null),
        outNeighborsCount: Object.create(null),
        allNeighborsCount: Object.create(null),
        // source-target 정보를 가진 전체 데이터셋
        gData: {},
        // 그래프를 그리고 싶지 않은 목록들을 여기에 넣는다.
        exceptions: {
            "kubernetes": true,
            "network": true,
            "volume": true,
        },
        // 전체 source-target 에서 특정 id를 기준으로 데이터추출을 하기 위해 필요한 데이터셋
// {자식: 연결된부모} 정보로 된 연결고리로만 이루어져 있다
        parentDisjoint: {},
        nodesLevelCount: {}, // 토탈 전체  node 수
        selectNodesLevelCount: {}, // 선택된 node 수
        maxNodeCount: 0,
    },
    topologyData2: Object.create(null),
    topologyData3: Object.create(null),
    randomData(domW, domH) {
        this.kubegraphJsonData = {
            "nodes": [
                {
                    "id": "I-1",
                    "data": {
                        "type": "ingress",
                        "name": "www.ex-em.com",
                        "spec": {"dns": "www.ex-em.com", "static-ip": ""},
                    },
                },
                {
                    "id": "I-2",
                    "data": {
                        "type": "ingress",
                        "name": "dev.ex-em.com",
                        "spec": {"dns": "dev.ex-em.com", "static-ip": ""},
                    },
                },
                {
                    "id": "S-1",
                    "data": {
                        "type": "service",
                        "name": "/users/*",
                        "spec": {
                            "labels": "app:users",
                            "type": "NodePort",
                            "path": "/users/*",
                            "ip": "192.168.0.1",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-2",
                    "data": {
                        "type": "service",
                        "name": "/products/*",
                        "spec": {
                            "labels": "app:products",
                            "type": "NodePort",
                            "path": "/products/*",
                            "ip": "192.168.0.2",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-3",
                    "data": {
                        "type": "service",
                        "name": "/academy/*",
                        "spec": {
                            "labels": "app:academy",
                            "type": "NodePort",
                            "path": "/academy/*",
                            "ip": "192.168.0.3",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-4",
                    "data": {
                        "type": "service",
                        "name": "mlist.ex-em.com",
                    },
                },
                {
                    "id": "S-5",
                    "data": {
                        "type": "service",
                        "name": "syncclip.ex-em.com",
                    },
                },
                {
                    "id": "S-6",
                    "data": {
                        "type": "service",
                        "name": "/kubernetes/*",
                        "spec": {
                            "labels": "app:kubernetes",
                            "type": "NodePort",
                            "path": "/kubernetes/*",
                            "ip": "192.168.0.6",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-7",
                    "data": {
                        "type": "service",
                        "name": "/openstack/*",
                        "spec": {
                            "labels": "app:openstack",
                            "type": "NodePort",
                            "path": "/openstack/*",
                            "ip": "192.168.0.7",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-8",
                    "data": {
                        "type": "service",
                        "name": "/gcp/*",
                        "spec": {
                            "labels": "app:gcp",
                            "type": "NodePort",
                            "path": "/gcp/*",
                            "ip": "192.168.0.8",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-9",
                    "data": {
                        "type": "service",
                        "name": "/aws/*",
                        "spec": {
                            "labels": "app:aws",
                            "type": "NodePort",
                            "path": "/aws/*",
                            "ip": "192.168.0.9",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-10",
                    "data": {
                        "type": "service",
                        "name": "/azure/*",
                        "spec": {
                            "labels": "app:azure",
                            "type": "NodePort",
                            "path": "/azure/*",
                            "ip": "192.168.0.10",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-11",
                    "data": {
                        "type": "service",
                        "name": "go.ex-em.com",
                        "spec": {
                            "labels": "app:azure",
                            "type": "ExternalName",
                            "externalName": "go.ex-em.com",
                            "ports": [{"protocol": "http", "source": "80", "targetPort": "8080"}],
                        },
                    },
                },
                {
                    "id": "S-12",
                    "data": {
                        "type": "service",
                        "name": "external.ex-em.com",
                    },
                },
                {
                    "id": "S-13",
                    "data": {
                        "type": "service",
                        "name": "maxgauge.ex-em.com",
                    },
                },
                {
                    "id": "S-14",
                    "data": {
                        "type": "service",
                        "name": "pcm.ex-em.com",
                    },
                },
                {
                    "id": "S-15",
                    "data": {
                        "type": "service",
                        "name": "sms.ex-em.com",
                    },
                },
                {
                    "id": "S-16",
                    "data": {
                        "type": "service",
                        "name": "nms.ex-em.com",
                    },
                },
                {
                    "id": "S-17",
                    "data": {
                        "type": "service",
                        "name": "banking.ex-em.com",
                    },
                },
                {
                    "id": "S-18",
                    "data": {
                        "type": "service",
                        "name": "tel.ex-em.com",
                    },
                },
                {
                    "id": "S-19",
                    "data": {
                        "type": "service",
                        "name": "share.ex-em.com",
                    },
                },
                {
                    "id": "S-20",
                    "data": {
                        "type": "service",
                        "name": "apm.ex-em.com",
                    },
                },
                {
                    "id": "S-21",
                    "data": {
                        "type": "service",
                        "name": "ems.ex-em.com",
                    },
                },
                {
                    "id": "P-S101",
                    "data": {
                        "type": "pod",
                        "name": "P-S101",
                    },
                },
                {
                    "id": "P-S102",
                    "data": {
                        "type": "pod",
                        "name": "P-S102",
                    },
                },
                {
                    "id": "P-S103",
                    "data": {
                        "type": "pod",
                        "name": "P-S103",
                    },
                },
                {
                    "id": "P-S104",
                    "data": {
                        "type": "pod",
                        "name": "P-S104",
                    },
                },
                {
                    "id": "P-S105",
                    "data": {
                        "type": "pod",
                        "name": "P-S105",
                    },
                },
                {
                    "id": "P-S201",
                    "data": {
                        "type": "pod",
                        "name": "P-S201",
                    },
                },
                {
                    "id": "P-S202",
                    "data": {
                        "type": "pod",
                        "name": "P-S202",
                    },
                },
                {
                    "id": "P-S203",
                    "data": {
                        "type": "pod",
                        "name": "P-S203",
                    },
                },
                {
                    "id": "P-S204",
                    "data": {
                        "type": "pod",
                        "name": "P-S104",
                    },
                },
                {
                    "id": "P-S205",
                    "data": {
                        "type": "pod",
                        "name": "P-S205",
                    },
                },
                {
                    "id": "P-S301",
                    "data": {
                        "type": "pod",
                        "name": "P-S301",
                    },
                },
                {
                    "id": "P-S302",
                    "data": {
                        "type": "pod",
                        "name": "P-S302",
                    },
                },
                {
                    "id": "P-S303",
                    "data": {
                        "type": "pod",
                        "name": "P-S303",
                    },
                },
                {
                    "id": "P-S304",
                    "data": {
                        "type": "pod",
                        "name": "P-S304",
                    },
                },
                {
                    "id": "P-S305",
                    "data": {
                        "type": "pod",
                        "name": "P-S305",
                    },
                },
                {
                    "id": "P-S401",
                    "data": {
                        "type": "pod",
                        "name": "P-S401",
                    },
                },
                {
                    "id": "P-S402",
                    "data": {
                        "type": "pod",
                        "name": "P-S402",
                    },
                },
                {
                    "id": "P-S403",
                    "data": {
                        "type": "pod",
                        "name": "P-S403",
                    },
                },
                {
                    "id": "P-S404",
                    "data": {
                        "type": "pod",
                        "name": "P-S404",
                    },
                },
                {
                    "id": "P-S405",
                    "data": {
                        "type": "pod",
                        "name": "P-S405",
                    },
                },
                {
                    "id": "P-S406",
                    "data": {
                        "type": "pod",
                        "name": "P-S406",
                    },
                },
                {
                    "id": "P-S407",
                    "data": {
                        "type": "pod",
                        "name": "P-S407",
                    },
                },
                // {
                //     "id": "P-S408",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S408",
                //     },
                // },
                // {
                //     "id": "P-S409",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S409",
                //     },
                // },
                // {
                //     "id": "P-S410",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S410",
                //     },
                // },
                // {
                //     "id": "P-S501",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S501",
                //     },
                // },
                // {
                //     "id": "P-S502",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S502",
                //     },
                // },
                // {
                //     "id": "P-S503",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S503",
                //     },
                // },
                // {
                //     "id": "P-S504",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S504",
                //     },
                // },
                // {
                //     "id": "P-S505",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S505",
                //     },
                // },
                // {
                //     "id": "P-S506",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S506",
                //     },
                // },
                // {
                //     "id": "P-S507",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S507",
                //     },
                // },
                // {
                //     "id": "P-S601",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S601",
                //     },
                // },
                // {
                //     "id": "P-S602",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S602",
                //     },
                // },
                // {
                //     "id": "P-S603",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S603",
                //     },
                // },
                // {
                //     "id": "P-S604",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S604",
                //     },
                // },
                // {
                //     "id": "P-S605",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S605",
                //     },
                // },
                // {
                //     "id": "P-S701",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S701",
                //     },
                // },
                // {
                //     "id": "P-S702",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S702",
                //     },
                // },
                // {
                //     "id": "P-S703",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S703",
                //     },
                // },
                // {
                //     "id": "P-S704",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S704",
                //     },
                // },
                // {
                //     "id": "P-S705",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S705",
                //     },
                // },
                // {
                //     "id": "P-S801",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S801",
                //     },
                // },
                // {
                //     "id": "P-S802",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S802",
                //     },
                // },
                // {
                //     "id": "P-S803",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S803",
                //     },
                // },
                // {
                //     "id": "P-S804",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S804",
                //     },
                // },
                // {
                //     "id": "P-S805",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S805",
                //     },
                // },
                // {
                //     "id": "P-S901",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S601",
                //     },
                // },
                // {
                //     "id": "P-S902",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S902",
                //     },
                // },
                // {
                //     "id": "P-S903",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S903",
                //     },
                // },
                // {
                //     "id": "P-S904",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S604",
                //     },
                // },
                // {
                //     "id": "P-S905",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S905",
                //     },
                // },
                // {
                //     "id": "P-S1001",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1001",
                //     },
                // },
                // {
                //     "id": "P-S1002",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1002",
                //     },
                // },
                // {
                //     "id": "P-S1003",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1003",
                //     },
                // },
                // {
                //     "id": "P-S1004",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1004",
                //     },
                // },
                // {
                //     "id": "P-S1005",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1005",
                //     },
                // },
                // {
                //     "id": "P-S1101",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1101",
                //     },
                // },
                // {
                //     "id": "P-S1102",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1102",
                //     },
                // },
                // {
                //     "id": "P-S1103",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1103",
                //     },
                // },
                // {
                //     "id": "P-S1104",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1104",
                //     },
                // },
                // {
                //     "id": "P-S1105",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1105",
                //     },
                // },
                // {
                //     "id": "P-S1106",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1106",
                //     },
                // },
                // {
                //     "id": "P-S1107",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1107",
                //     },
                // },
                // {
                //     "id": "P-S1108",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1108",
                //     },
                // },
                // {
                //     "id": "P-S1201",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1201",
                //     },
                // },
                // {
                //     "id": "P-S1202",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1202",
                //     },
                // },
                // {
                //     "id": "P-S1203",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1203",
                //     },
                // },
                // {
                //     "id": "P-S1204",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1204",
                //     },
                // },
                // {
                //     "id": "P-S1205",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1205",
                //     },
                // },
                // {
                //     "id": "P-S1206",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1206",
                //     },
                // },
                // {
                //     "id": "P-S1207",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1207",
                //     },
                // },
                // {
                //     "id": "P-S1208",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1208",
                //     },
                // },
                // {
                //     "id": "P-S1209",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1209",
                //     },
                // },
                // {
                //     "id": "P-S1210",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1210",
                //     },
                // },
                // {
                //     "id": "P-S1301",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1301",
                //     },
                // },
                // {
                //     "id": "P-S1302",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1302",
                //     },
                // },
                // {
                //     "id": "P-S1303",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1303",
                //     },
                // },
                // {
                //     "id": "P-S1304",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1304",
                //     },
                // },
                // {
                //     "id": "P-S1305",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1305",
                //     },
                // },
                // {
                //     "id": "P-S1401",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1401",
                //     },
                // },
                // {
                //     "id": "P-S1402",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1402",
                //     },
                // },
                // {
                //     "id": "P-S1403",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1403",
                //     },
                // },
                // {
                //     "id": "P-S1404",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1404",
                //     },
                // },
                // {
                //     "id": "P-S1405",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1405",
                //     },
                // },
                // {
                //     "id": "P-S1406",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1406",
                //     },
                // },
                // {
                //     "id": "P-S1407",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1407",
                //     },
                // },
                // {
                //     "id": "P-S1501",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1501",
                //     },
                // },
                // {
                //     "id": "P-S1502",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1502",
                //     },
                // },
                // {
                //     "id": "P-S1503",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1503",
                //     },
                // },
                // {
                //     "id": "P-S1504",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1504",
                //     },
                // },
                // {
                //     "id": "P-S1505",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1505",
                //     },
                // },
                // {
                //     "id": "P-S1506",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1506",
                //     },
                // },
                // {
                //     "id": "P-S1507",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1507",
                //     },
                // },
                // {
                //     "id": "P-S1508",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1508",
                //     },
                // },
                // {
                //     "id": "P-S1509",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1509",
                //     },
                // },
                // {
                //     "id": "P-S1510",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1510",
                //     },
                // },
                // {
                //     "id": "P-S1601",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1601",
                //     },
                // },
                // {
                //     "id": "P-S1602",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1602",
                //     },
                // },
                // {
                //     "id": "P-S1603",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1603",
                //     },
                // },
                // {
                //     "id": "P-S1604",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1604",
                //     },
                // },
                // {
                //     "id": "P-S1605",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1605",
                //     },
                // },
                // {
                //     "id": "P-S1606",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1606",
                //     },
                // },
                // {
                //     "id": "P-S1607",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1607",
                //     },
                // },
                // {
                //     "id": "P-S1608",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1608",
                //     },
                // },
                // {
                //     "id": "P-S1609",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1609",
                //     },
                // },
                // {
                //     "id": "P-S1610",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1610",
                //     },
                // },
                // {
                //     "id": "P-S1701",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1601",
                //     },
                // },
                // {
                //     "id": "P-S1702",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1702",
                //     },
                // },
                // {
                //     "id": "P-S1703",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1703",
                //     },
                // },
                // {
                //     "id": "P-S1704",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1704",
                //     },
                // },
                // {
                //     "id": "P-S1705",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1705",
                //     },
                // },
                // {
                //     "id": "P-S1706",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1706",
                //     },
                // },
                // {
                //     "id": "P-S1707",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1707",
                //     },
                // },
                // {
                //     "id": "P-S1708",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1708",
                //     },
                // },
                // {
                //     "id": "P-S1709",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1709",
                //     },
                // },
                // {
                //     "id": "P-S1710",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1710",
                //     },
                // },
                // {
                //     "id": "P-S1801",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1801",
                //     },
                // },
                // {
                //     "id": "P-S1802",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1802",
                //     },
                // },
                // {
                //     "id": "P-S1803",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1803",
                //     },
                // },
                // {
                //     "id": "P-S1804",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1804",
                //     },
                // },
                // {
                //     "id": "P-S1805",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1805",
                //     },
                // },
                // {
                //     "id": "P-S1806",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1806",
                //     },
                // },
                // {
                //     "id": "P-S1807",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1807",
                //     },
                // },
                // {
                //     "id": "P-S1808",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1808",
                //     },
                // },
                // {
                //     "id": "P-S1809",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1809",
                //     },
                // },
                // {
                //     "id": "P-S1810",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1810",
                //     },
                // },
                // {
                //     "id": "P-S1901",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1901",
                //     },
                // },
                // {
                //     "id": "P-S1902",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S1902",
                //     },
                // },
                // {
                //     "id": "P-S2001",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2001",
                //     },
                // },
                // {
                //     "id": "P-S2002",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2002",
                //     },
                // },
                // {
                //     "id": "P-S2003",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2003",
                //     },
                // },
                // {
                //     "id": "P-S2004",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2004",
                //     },
                // },
                // {
                //     "id": "P-S2005",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2005",
                //     },
                // },
                // {
                //     "id": "P-S2101",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2101",
                //     },
                // },
                // {
                //     "id": "P-S2102",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2102",
                //     },
                // },
                // {
                //     "id": "P-S2103",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2103",
                //     },
                // },
                // {
                //     "id": "P-S2104",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2104",
                //     },
                // },
                // {
                //     "id": "P-S2105",
                //     "data": {
                //         "type": "pod",
                //         "name": "P-S2105",
                //     },
                // },
            ],
            "edges": [
                {"source": "I-1", "target": "S-1"}, {
                    "source": "I-1",
                    "target": "S-2",
                }, {"source": "I-1", "target": "S-3"}, {
                    "source": "I-2",
                    "target": "S-6",
                }, {"source": "I-2", "target": "S-7"}, {
                    "source": "I-2",
                    "target": "S-8",
                }, {"source": "I-2", "target": "S-9"}, {
                    "source": "I-2",
                    "target": "S-10",
                },
                {"source": "S-1", "target": "P-S101"}, {
                    "source": "S-1",
                    "target": "P-S102",
                }, {"source": "S-1", "target": "P-S103"}, {
                    "source": "S-1",
                    "target": "P-S104",
                }, {"source": "S-1", "target": "P-S105"}, {
                    "source": "S-2",
                    "target": "P-S201",
                }, {"source": "S-2", "target": "P-S202"}, {
                    "source": "S-2",
                    "target": "P-S203",
                }, {"source": "S-2", "target": "P-S204"}, {
                    "source": "S-2",
                    "target": "P-S205",
                }, {"source": "S-3", "target": "P-S301"}, {
                    "source": "S-3",
                    "target": "P-S302",
                }, {"source": "S-3", "target": "P-S303"}, {
                    "source": "S-3",
                    "target": "P-S304",
                }, {"source": "S-3", "target": "P-S305"}, {
                    "source": "S-4",
                    "target": "P-S401",
                }, {"source": "S-4", "target": "P-S402"}, {
                    "source": "S-4",
                    "target": "P-S403",
                }, {"source": "S-4", "target": "P-S404"}, {
                    "source": "S-4",
                    "target": "P-S405",
                }, {"source": "S-4", "target": "P-S406"}, {
                    "source": "S-4",
                    "target": "P-S407",
                },
                // {"source": "S-4", "target": "P-S408"}, {
                //     "source": "S-4",
                //     "target": "P-S409",
                // }, {"source": "S-4", "target": "P-S410"}, {
                //     "source": "S-5",
                //     "target": "P-S501",
                // }, {"source": "S-5", "target": "P-S502"}, {
                //     "source": "S-5",
                //     "target": "P-S503",
                // }, {"source": "S-5", "target": "P-S504"}, {
                //     "source": "S-5",
                //     "target": "P-S505",
                // }, {"source": "S-5", "target": "P-S506"}, {
                //     "source": "S-5",
                //     "target": "P-S507",
                // }, {"source": "S-6", "target": "P-S601"}, {
                //     "source": "S-6",
                //     "target": "P-S602",
                // }, {"source": "S-6", "target": "P-S603"}, {
                //     "source": "S-6",
                //     "target": "P-S604",
                // }, {"source": "S-6", "target": "P-S605"}, {
                //     "source": "S-7",
                //     "target": "P-S701",
                // }, {"source": "S-7", "target": "P-S702"}, {
                //     "source": "S-7",
                //     "target": "P-S703",
                // }, {"source": "S-7", "target": "P-S704"}, {
                //     "source": "S-7",
                //     "target": "P-S705",
                // }, {"source": "S-8", "target": "P-S801"}, {
                //     "source": "S-8",
                //     "target": "P-S802",
                // }, {"source": "S-8", "target": "P-S803"}, {
                //     "source": "S-8",
                //     "target": "P-S804",
                // }, {"source": "S-8", "target": "P-S805"}, {
                //     "source": "S-9",
                //     "target": "P-S901",
                // }, {"source": "S-9", "target": "P-S902"}, {
                //     "source": "S-9",
                //     "target": "P-S903",
                // }, {"source": "S-9", "target": "P-S904"}, {
                //     "source": "S-9",
                //     "target": "P-S905",
                // }, {"source": "S-10", "target": "P-S1001"}, {
                //     "source": "S-10",
                //     "target": "P-S1002",
                // }, {"source": "S-10", "target": "P-S1003"}, {
                //     "source": "S-10",
                //     "target": "P-S1004",
                // }, {"source": "S-10", "target": "P-S1005"}, {
                //     "source": "S-11",
                //     "target": "P-S1101",
                // }, {"source": "S-11", "target": "P-S1102"}, {
                //     "source": "S-11",
                //     "target": "P-S1103",
                // }, {"source": "S-11", "target": "P-S1104"}, {
                //     "source": "S-11",
                //     "target": "P-S1105",
                // }, {"source": "S-11", "target": "P-S1106"}, {
                //     "source": "S-11",
                //     "target": "P-S1107",
                // }, {"source": "S-11", "target": "P-S1108"}, {
                //     "source": "S-12",
                //     "target": "P-S1201",
                // }, {"source": "S-12", "target": "P-S1202"}, {
                //     "source": "S-12",
                //     "target": "P-S1203",
                // }, {"source": "S-12", "target": "P-S1204"}, {
                //     "source": "S-12",
                //     "target": "P-S1205",
                // }, {"source": "S-12", "target": "P-S1206"}, {
                //     "source": "S-12",
                //     "target": "P-S1207",
                // }, {"source": "S-12", "target": "P-S1208"}, {
                //     "source": "S-12",
                //     "target": "P-S1209",
                // }, {"source": "S-12", "target": "P-S1210"}, {
                //     "source": "S-13",
                //     "target": "P-S1301",
                // }, {"source": "S-13", "target": "P-S1302"}, {
                //     "source": "S-13",
                //     "target": "P-S1303",
                // }, {"source": "S-13", "target": "P-S1304"}, {
                //     "source": "S-13",
                //     "target": "P-S1305",
                // }, {"source": "S-14", "target": "P-S1401"}, {
                //     "source": "S-14",
                //     "target": "P-S1402",
                // }, {"source": "S-14", "target": "P-S1403"}, {
                //     "source": "S-14",
                //     "target": "P-S1404",
                // }, {"source": "S-14", "target": "P-S1405"}, {
                //     "source": "S-14",
                //     "target": "P-S1406",
                // }, {"source": "S-14", "target": "P-S1407"}, {
                //     "source": "S-15",
                //     "target": "P-S1501",
                // }, {"source": "S-15", "target": "P-S1502"}, {
                //     "source": "S-15",
                //     "target": "P-S1503",
                // }, {"source": "S-15", "target": "P-S1504"}, {
                //     "source": "S-15",
                //     "target": "P-S1505",
                // }, {"source": "S-15", "target": "P-S1506"}, {
                //     "source": "S-15",
                //     "target": "P-S1507",
                // }, {"source": "S-15", "target": "P-S1508"}, {
                //     "source": "S-15",
                //     "target": "P-S1509",
                // }, {"source": "S-15", "target": "P-S1510"}, {
                //     "source": "S-16",
                //     "target": "P-S1601",
                // }, {"source": "S-16", "target": "P-S1602"}, {
                //     "source": "S-16",
                //     "target": "P-S1603",
                // }, {"source": "S-16", "target": "P-S1604"}, {
                //     "source": "S-16",
                //     "target": "P-S1605",
                // }, {"source": "S-16", "target": "P-S1606"}, {
                //     "source": "S-16",
                //     "target": "P-S1607",
                // }, {"source": "S-16", "target": "P-S1608"}, {
                //     "source": "S-16",
                //     "target": "P-S1609",
                // }, {"source": "S-16", "target": "P-S1610"}, {
                //     "source": "S-17",
                //     "target": "P-S1701",
                // }, {"source": "S-17", "target": "P-S1702"}, {
                //     "source": "S-17",
                //     "target": "P-S1703",
                // }, {"source": "S-17", "target": "P-S1704"}, {
                //     "source": "S-17",
                //     "target": "P-S1705",
                // }, {"source": "S-17", "target": "P-S1706"}, {
                //     "source": "S-17",
                //     "target": "P-S1707",
                // }, {"source": "S-17", "target": "P-S1708"}, {
                //     "source": "S-17",
                //     "target": "P-S1709",
                // }, {"source": "S-17", "target": "P-S1710"}, {
                //     "source": "S-18",
                //     "target": "P-S1801",
                // }, {"source": "S-18", "target": "P-S1802"}, {
                //     "source": "S-18",
                //     "target": "P-S1803",
                // }, {"source": "S-18", "target": "P-S1804"}, {
                //     "source": "S-18",
                //     "target": "P-S1805",
                // }, {"source": "S-18", "target": "P-S1806"}, {
                //     "source": "S-18",
                //     "target": "P-S1807",
                // }, {"source": "S-18", "target": "P-S1808"}, {
                //     "source": "S-18",
                //     "target": "P-S1809",
                // }, {"source": "S-18", "target": "P-S1810"}, {
                //     "source": "S-19",
                //     "target": "P-S1901",
                // }, {"source": "S-19", "target": "P-S1902"}, {
                //     "source": "S-20",
                //     "target": "P-S2001",
                // }, {"source": "S-20", "target": "P-S2002"}, {
                //     "source": "S-20",
                //     "target": "P-S2003",
                // }, {"source": "S-20", "target": "P-S2004"}, {
                //     "source": "S-20",
                //     "target": "P-S2005",
                // }, {"source": "S-21", "target": "P-S2101"}, {
                //     "source": "S-21",
                //     "target": "P-S2102",
                // }, {"source": "S-21", "target": "P-S2103"}, {
                //     "source": "S-21",
                //     "target": "P-S2104",
                // }, {"source": "S-21", "target": "P-S2105"},
            ],
        };


        // this.topologyData.nodes = [
        //     // {
        //     //     "id": "I-2",
        //     //     "data" : {
        //     //         "type": "ingress",
        //     //         "name" : "I-1",
        //     //         "spec" : { "dns":"dev.ex-em.com", "static-ip": "" }
        //     //     }
        //     // },
        //     {
        //         "id": "d0",
        //         "label": "DataCenter",
        //         "type": "DataCenter",
        //         "size": 12,
        //         level: 1,
        //         "color": "#e50613",
        //         "x": 965,
        //         "y": 437,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "c1",
        //         "label": "cluster-1",
        //         "type": "cluster",
        //         "size": 12,
        //         level: 2,
        //         "color": "#ff9474",
        //         "x": 1125,
        //         "y": 346,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n1",
        //         "label": "Node-1",
        //         "type": "Node",
        //         "size": 12,
        //         level: 3,
        //         "color": "#93bcff",
        //         "x": 1260,
        //         "y": 386,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n2",
        //         "label": "Node-2",
        //         "type": "Node",
        //         "size": 12,
        //         level: 3,
        //         "color": "#93bcff",
        //         "x": 1154,
        //         "y": 442,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n3",
        //         "label": "Node-3",
        //         "type": "Node",
        //         "size": 12,
        //         level: 3,
        //         "color": "#93bcff",
        //         "x": 1042,
        //         "y": 265,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n4",
        //         "label": "Node-4",
        //         "type": "Node",
        //         "size": 12,
        //         level: 3,
        //         "color": "#93bcff",
        //         "x": 981,
        //         "y": 337,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n5",
        //         "label": "Node-5",
        //         "type": "Node",
        //         "size": 12,
        //         level: 3,
        //         "color": "#93bcff",
        //         "x": 1299,
        //         "y": 254,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p1",
        //         "label": "Pod-1",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 4,
        //         "color": "#2057ff",
        //         "x": 1274,
        //         "y": 135,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p2",
        //         "label": "Pod-2",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 4,
        //         "color": "#2057ff",
        //         "x": 1165,
        //         "y": 203,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p3",
        //         "label": "Pod-3",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 4,
        //         "color": "#2057ff",
        //         "x": 1432,
        //         "y": 170,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p4",
        //         "label": "Pod-4",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 4,
        //         "color": "#2057ff",
        //         "x": 1457,
        //         "y": 260,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "c3",
        //         "label": "cluster-3",
        //         "type": "cluster",
        //         "size": 12,
        //         level: 2,
        //         "color": "#ff9474",
        //         "x": 909,
        //         "y": 541,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n6",
        //         "label": "Node-6",
        //         "type": "Node",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 876,
        //         "y": 480,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n7",
        //         "label": "Node-7",
        //         "type": "Node",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 1013,
        //         "y": 514,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n8",
        //         "label": "Node-8",
        //         "type": "Node",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 832,
        //         "y": 547,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n9",
        //         "label": "Node-9",
        //         "type": "Node",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 887,
        //         "y": 594,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n10",
        //         "label": "Node-10",
        //         "type": "Node-",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 982,
        //         "y": 620,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p5",
        //         "label": "Pod-5",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 3,
        //         "color": "#2057ff",
        //         "x": 927,
        //         "y": 686,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p6",
        //         "label": "Pod-6",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 3,
        //         "color": "#2057ff",
        //         "x": 1064,
        //         "y": 719,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p7",
        //         "label": "Pod-7",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 3,
        //         "color": "#2057ff",
        //         "x": 1109,
        //         "y": 640,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "c2",
        //         "label": "cluster-2",
        //         "type": "cluster",
        //         "size": 12,
        //         level: 2,
        //         "color": "#ff9474",
        //         "x": 740,
        //         "y": 329,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n11",
        //         "label": "Node-11",
        //         "type": "Node-",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 759,
        //         "y": 443,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n12",
        //         "label": "Node-12",
        //         "type": "Node-",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 838,
        //         "y": 342,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n13",
        //         "label": "Node-13",
        //         "type": "Node-",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 839,
        //         "y": 289,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n14",
        //         "label": "Node-14",
        //         "type": "Node-",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 793,
        //         "y": 238,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n15",
        //         "label": "Node-15",
        //         "type": "Node-",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 659,
        //         "y": 419,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "n16",
        //         "label": "Node-16",
        //         "type": "Node-",
        //         "size": 12,
        //         level: 2,
        //         "color": "#93bcff",
        //         "x": 649,
        //         "y": 258,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p8",
        //         "label": "Pod-8",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 3,
        //         "color": "#2057ff",
        //         "x": 604,
        //         "y": 358,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p9",
        //         "label": "Pod-9",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 3,
        //         "color": "#2057ff",
        //         "x": 699,
        //         "y": 155,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p10",
        //         "label": "Pod-10",
        //         "type": "Pod",
        //         "size": 12,
        //         level: 3,
        //         "color": "#2057ff",
        //         "x": 564,
        //         "y": 189,
        //         "width": 5,
        //         "height": 5,
        //         "inPointer": false,
        //     }, {
        //         "id": "p11",
        //         "label": "Pod-11",
        //         "type": "Pod",
        //         "x": 509,
        //         "y": 281,
        //         "width": 5,
        //         "height": 5,
        //         "size": 12,
        //         level: 3,
        //         "color": "#2057ff",
        //         "inPointer": false,
        //     },
        // ];


        // this.topologyData.edges = [
        //     {
        //         id: `e0`,
        //         label: `Edge 0`,
        //         source: "d0",
        //         target: "c1",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e1`,
        //         label: `Edge 1`,
        //         source: "d0",
        //         target: "c2",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e2`,
        //         label: `Edge 2`,
        //         source: "d0",
        //         target: "c3",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e3`,
        //         label: `Edge 3`,
        //         source: "c1",
        //         target: "n1",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e4`,
        //         label: `Edge 4`,
        //         source: "c1",
        //         target: "n2",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e5`,
        //         label: `Edge 5`,
        //         source: "c1",
        //         target: "n3",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e6`,
        //         label: `Edge 6`,
        //         source: "c1",
        //         target: "n4",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e7`,
        //         label: `Edge 7`,
        //         active: true,
        //         source: "c1",
        //         target: "n5",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e8`,
        //         label: `Edge 8`,
        //         source: "n5",
        //         target: "p1",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e9`,
        //         label: `Edge 9`,
        //         source: "n5",
        //         target: "p2",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e10`,
        //         label: `Edge 10`,
        //         source: "n5",
        //         target: "p3",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e11`,
        //         label: `Edge 11`,
        //         source: "n5",
        //         target: "p4",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e12`,
        //         label: `Edge 11`,
        //         source: "c3",
        //         target: "n6",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e13`,
        //         label: `Edge 13`,
        //         source: "c3",
        //         target: "n7",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e14`,
        //         label: `Edge 14`,
        //         source: "c3",
        //         target: "n8",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e15`,
        //         label: `Edge 15`,
        //         source: "c3",
        //         target: "n9",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e16`,
        //         label: `Edge 16`,
        //         source: "c3",
        //         target: "n10",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e17`,
        //         label: `Edge 17`,
        //         source: "n10",
        //         target: "p5",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e18`,
        //         label: `Edge 18`,
        //         source: "n10",
        //         target: "p6",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e19`,
        //         label: `Edge 19`,
        //         source: "n10",
        //         target: "p7",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e20`,
        //         label: `Edge 20`,
        //         source: "c2",
        //         target: "n11",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e21`,
        //         label: `Edge 21`,
        //         source: "c2",
        //         target: "n12",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e22`,
        //         label: `Edge 22`,
        //         source: "c2",
        //         target: "n13",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e23`,
        //         label: `Edge 23`,
        //         source: "c2",
        //         target: "n14",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e24`,
        //         label: `Edge 25`,
        //         source: "c2",
        //         target: "n15",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e26`,
        //         label: `Edge 26`,
        //         source: "c2",
        //         target: "n16",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e27`,
        //         label: `Edge 27`,
        //         source: "n16",
        //         target: "p8",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e28`,
        //         label: `Edge 28`,
        //         source: "n16",
        //         target: "p9",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e29`,
        //         label: `Edge 29`,
        //         source: "n16",
        //         target: "p10",
        //         size: 11,
        //         color: "#9b9ba3",
        //     }, {
        //         id: `e30`,
        //         label: `Edge 30`,
        //         source: "n16",
        //         target: "p11",
        //         size: 11,
        //         color: "#9b9ba3",
        //     },
        // ];
        //
        // for (let ix = 0; ix < this.nodeCnt; ix++) {
        //     this.topologyData.nodes.push({
        //         id: `n${ix}`,
        //         label: `Node ${ix}`,
        //         x: Math.random() * 1800 | 0,
        //         y: Math.random() * 800 | 0,
        //         width: 5,
        //         height: 5,
        //         size: 15,
        //         color: "#4de58b",
        //     });
        // }


        // for (let ix = 0; ix < 30; ix++) {
        //     this.topologyData.edges.push({
        //         id: `e${ix}`,
        //         label: `Edge ${ix}`,
        //         source: `n${Math.random() * this.nodeCnt | 0}`,
        //         target: `n${Math.random() * this.nodeCnt | 0}`,
        //         size: Math.random(),
        //         color: "#ccc",
        //     });
        // }

        this.createNGraph();

        const ratioScale = domW > domH ? domH * 2 : domW * 2;

        const physicsSettings = {
            springLength: 70,
            gravity: -0.14,
        };
        const flayout = ForceLayout(this.g, physicsSettings);
        let isStable = false;

        // 좌표 계산
        while (!isStable) {
            isStable = flayout.step();
        }

        this.g.forEachNode(node => {
            const pos = flayout.getNodePosition(node.id);

            node.width = ((config.nodeSize * 2));
            node.height = ((config.nodeSize * 2));
            node.size = (config.nodeSize);
            node.inPointer = false;
            node.pos3dX = pos.x;
            node.x = (pos.x + domW / 2);
            node.pos3dY = pos.y;
            node.y = (pos.y + domH / 2);
            this.topologyData.nodes.push(node);
        });
        this.g.forEachLink(link => {
            const source = this.g.getNode(link.fromId);
            const target = this.g.getNode(link.toId);

            this.topologyData.edges.push(link);
            // console.log(source, target);
            // createEdge(source, target);
        });
        this.read(this.topologyData);


        this.topologyData2 = JSON.parse(JSON.stringify(this.topologyData));
        this.topologyData3 = JSON.parse(JSON.stringify(this.topologyData));
        this.g = null;
    },

    createNGraph() {
        const data = this.kubegraphJsonData;

        this.g = new Graph();

        this.g.services = [];
        const nodeLen = data.nodes.length;

        for (let i = 0; i < nodeLen; i++) {
            const nd = data.nodes[i];
            const ndid = nd.id;

            this.g.addNode(ndid, nd.data);

            if (nd.data.type === "ingress" || nd.data.type === "service") {
                this.topologyData.services.push(nd);
            }
        }

        const edgeLen = data.edges.length;

        for (let j = 0; j < edgeLen; j++) {
            const myEdge = data.edges[j];
            const sourceNode = myEdge.source;
            const targetNode = myEdge.target;

            this.g.addLink(sourceNode, targetNode);
        }
    },

    randMinMax(min, max, round) {
        let val = min + (Math.random() * (max - min));

        if (round) val = Math.round(val);

        return val;
    },
    read(topologData) {
        let ix;
        let data;
        let ixLen;

        data = topologData.nodes || [];
        for (ix = 0, ixLen = data.length; ix < ixLen; ix++) {
            this.addDataNode(data[ix]);
            // 트리 데이터 만들기 start
            if (!this.hasExceptionType(data[ix])) {
                // 계층별 노드 추가
                if (!this.hasId(data[ix].id)) {
                    this.addNode(data[ix]);
                    this.addNodeLevel(data[ix]);
                }
            }
            // 트리 데이터 만들기 end
        }

        data = topologData.edges || [];
        for (ix = 0, ixLen = data.length; ix < ixLen; ix++) {
            this.addDataEdge(data[ix]);

            // 트리 데이터 만들기 start
            const source = data[ix].from || data[ix]._from || data[ix].source;
            const target = data[ix].to || data[ix]._to || data[ix].target;

            // 데이터구조 from --> node id 를 찾아간다.
            const node = this.getNodeById(source);

            if (node === undefined) {
                return;
            }

            if (this.hasId(target)) {
                this.addChild(node, target);
            }
            // 트리 데이터 만들기 end
        }

        // 부모-자식 매칭정보 구성. disjoint set 이용
        const lvNodes = this.getNodesByLevel(1);

        lvNodes.map(root => this.setParentDisjt(root, root));
    },
    addDataNode(node) {
        const id = node.id;
        let validNode = Object.create(null);

        validNode = node;
        validNode.id = id;

        this.topologyData.inNeighborsIndex[id] = Object.create(null);
        this.topologyData.outNeighborsIndex[id] = Object.create(null);
        this.topologyData.allNeighborsIndex[id] = Object.create(null);

        this.topologyData.inNeighborsCount[id] = 0;
        this.topologyData.outNeighborsCount[id] = 0;
        this.topologyData.allNeighborsCount[id] = 0;

        // Add the node to indexes:
        this.topologyData.nodesArray.push(validNode);
        this.topologyData.nodesIndex[validNode.id] = validNode;

        return this;
    },

    addDataEdge(edge) {
        let validEdge = Object.create(null);

        validEdge = edge;

        validEdge.id = edge.id;
        validEdge.source = edge.source;
        validEdge.target = edge.target;

        this.topologyData.edgesArray.push(validEdge);
        this.topologyData.edgesIndex[validEdge.id] = validEdge;

        if (!this.topologyData.inNeighborsIndex[validEdge.target][validEdge.source]) {
            this.topologyData.inNeighborsIndex[validEdge.target][validEdge.source] =
                Object.create(null);
        }
        this.topologyData.inNeighborsIndex[validEdge.target][validEdge.source][validEdge.id] =
            validEdge;

        if (!this.topologyData.outNeighborsIndex[validEdge.source][validEdge.target]) {
            this.topologyData.outNeighborsIndex[validEdge.source][validEdge.target] =
                Object.create(null);
        }
        this.topologyData.outNeighborsIndex[validEdge.source][validEdge.target][validEdge.id] =
            validEdge;

        if (!this.topologyData.allNeighborsIndex[validEdge.source][validEdge.target]) {
            this.topologyData.allNeighborsIndex[validEdge.source][validEdge.target] =
                Object.create(null);
        }
        this.topologyData.allNeighborsIndex[validEdge.source][validEdge.target][validEdge.id] =
            validEdge;

        if (validEdge.target !== validEdge.source) {
            if (!this.topologyData.allNeighborsIndex[validEdge.target][validEdge.source]) {
                this.topologyData.allNeighborsIndex[validEdge.target][validEdge.source] =
                    Object.create(null);
            }
            this.topologyData.allNeighborsIndex[validEdge.target][validEdge.source][validEdge.id] =
                validEdge;
        }

        // Keep counts up to date:
        this.topologyData.inNeighborsCount[validEdge.target]++;
        this.topologyData.outNeighborsCount[validEdge.source]++;
        this.topologyData.allNeighborsCount[validEdge.target]++;
        this.topologyData.allNeighborsCount[validEdge.source]++;

        return this;
    },

    dropDataNode(id) {
        let i;
        let k;
        let
            l;

        // node 인덱스 제거
        delete this.topologyData.nodesIndex[id];
        for (i = 0, l = this.topologyData.nodesArray.length; i < l; i++) {
            if (this.topologyData.nodesArray[i].id === id) {
                this.topologyData.nodesArray.splice(i, 1);
                break;
            }
        }

        // edge 제거
        for (i = this.topologyData.edgesArray.length - 1; i >= 0; i--) {
            if (this.topologyData.edgesArray[i].source === id ||
                this.topologyData.edgesArray[i].target === id) {
                this.topologyData.dropDataEdge(this.topologyData.edgesArray[i].id);
            }
        }

        // edge 관련 인덱스 제거
        delete this.topologyData.inNeighborsIndex[id];
        delete this.topologyData.outNeighborsIndex[id];
        delete this.topologyData.allNeighborsIndex[id];

        delete this.topologyData.inNeighborsCount[id];
        delete this.topologyData.outNeighborsCount[id];
        delete this.topologyData.allNeighborsCount[id];

        for (k in this.topologyData.nodesIndex) {
            delete this.topologyData.inNeighborsIndex[k][id];
            delete this.topologyData.outNeighborsIndex[k][id];
            delete this.topologyData.allNeighborsIndex[k][id];
        }

        return this;
    },
    dropDataEdge(id) {
        let i;
        let l;
        // let edge;

        // edge 인덱스 제거
        const edge = this.topologyData.edgesIndex[id];

        delete this.topologyData.edgesIndex[id];
        for (i = 0, l = this.topologyData.edgesArray.length; i < l; i++) {
            if (this.topologyData.edgesArray[i].id === id) {
                this.topologyData.edgesArray.splice(i, 1);
                break;
            }
        }

        delete this.topologyData.inNeighborsIndex[edge.target][edge.source][edge.id];
        if (!Object.keys(this.topologyData.inNeighborsIndex[edge.target][edge.source]).length) {
            delete this.topologyData.inNeighborsIndex[edge.target][edge.source];
        }

        delete this.topologyData.outNeighborsIndex[edge.source][edge.target][edge.id];
        if (!Object.keys(this.topologyData.outNeighborsIndex[edge.source][edge.target]).length) {
            delete this.topologyData.outNeighborsIndex[edge.source][edge.target];
        }

        delete this.topologyData.allNeighborsIndex[edge.source][edge.target][edge.id];
        if (!Object.keys(this.topologyData.allNeighborsIndex[edge.source][edge.target]).length) {
            delete this.topologyData.allNeighborsIndex[edge.source][edge.target];
        }

        if (edge.target !== edge.source) {
            delete this.topologyData.allNeighborsIndex[edge.target][edge.source][edge.id];
            if (!Object.keys(this.topologyData
                .allNeighborsIndex[edge.target][edge.source]).length) {
                delete this.topologyData.allNeighborsIndex[edge.target][edge.source];
            }
        }

        this.topologyData.inNeighborsCount[edge.target]--;
        this.topologyData.outNeighborsCount[edge.source]--;
        this.topologyData.allNeighborsCount[edge.source]--;
        this.topologyData.allNeighborsCount[edge.target]--;

        return this;
    },
    topologyDataKill() {
// Delete arrays:
        this.topologyData.nodesArray.length = 0;
        this.topologyData.edgesArray.length = 0;
        delete this.topologyData.nodesArray;
        delete this.topologyData.edgesArray;

        // Delete indexes:
        delete this.topologyData.nodesIndex;
        delete this.topologyData.edgesIndex;
        delete this.topologyData.inNeighborsIndex;
        delete this.topologyData.outNeighborsIndex;
        delete this.topologyData.allNeighborsIndex;
        delete this.topologyData.inNeighborsCount;
        delete this.topologyData.outNeighborsCount;
        delete this.topologyData.allNeighborsCount;
        delete this.topologyData.gData;
    },
    topologyClear() {
        this.topologyData.nodesArray.length = 0;
        this.topologyData.edgesArray.length = 0;

        // Due to GC issues, I prefer not to create new object. These objects are
        // only available from the methods and attached functions, but still, it is
        // better to prevent ghost references to unrelevant data...
        this.emptyObject(this.topologyData.nodesIndex);
        this.emptyObject(this.topologyData.edgesIndex);
        this.emptyObject(this.topologyData.inNeighborsIndex);
        this.emptyObject(this.topologyData.outNeighborsIndex);
        this.emptyObject(this.topologyData.allNeighborsIndex);
        this.emptyObject(this.topologyData.inNeighborsCount);
        this.emptyObject(this.topologyData.outNeighborsCount);
        this.emptyObject(this.topologyData.allNeighborsCount);
        this.emptyObject(this.topologyData.gData);

        return this;
    },
    emptyObject(obj) {
        let k;

        for (k in obj) {
            if (!("hasOwnProperty" in obj) || Object.prototype.hasOwnProperty.call(k)) {
                delete obj[k];
            }
        }

        return obj;
    },
    // 그려질 그래프를 위해 자료구조를 정의하는 도중에
// 제외하고 싶은 목록들 (exceptions 변수)에 특정 노드가 포함이 되어있는지 판단
    hasExceptionType({type}) {
        if (type == null) return false;
        return Object.prototype.hasOwnProperty.call(this.topologyData.exceptions, type);
    },
    // id 프로퍼티를 가졌는지 확인
    hasId(id) {
        return Object.prototype.hasOwnProperty.call(this.topologyData.gData, id);
    },
    addNode({level, id, label, type}) {
        this.topologyData.gData[id] = {
            level,
            id,
            label,
            type,
            children: [],
        };
    },
    // 토탈 레벨 별 node 수
    addNodeLevel({level}) {
        let cnt = this.topologyData.nodesLevelCount[level] || 0;

        cnt++;
        this.topologyData.nodesLevelCount[level] = cnt;
    },
    getNodeById(id) {
        return this.topologyData.gData[id];
    },
    addChild(parent, child) {
        parent.children.push(child);
    },
    // 현재까지는 disjoint-set 구성을 위해서 level 1만 탐색하는 용도로 사용 중이다.
    getNodesByLevel(level) {
        const nodes = [];
        const ids = Object.keys(this.topologyData.gData);

        for (let i = 0; i < ids.length; i++) {
            if (parseInt(this.topologyData.gData[ids[i]].level, 10) === level) {
                nodes.push(ids[i]);
            }
        }
        return nodes;
    },
    // disjoint-set 구성
    setParentDisjt(parent, child) {
        if (!this.hasId(parent) || !this.hasChildren(parent)) {
            return;
        }


        if (!this.topologyData.parentDisjoint[child]) {
            this.topologyData.parentDisjoint[child] = parent;
        }

        this.topologyData.gData[child].children.forEach(nextChild => {
            this.setParentDisjt(child, nextChild);
        });
    },
    // children 프로퍼티를 갖고 있고 children의 length > 0 이면 true, 아니면 false
    hasChildren(id) {
        return Object.prototype.hasOwnProperty.call(this.topologyData.gData[id], "children") &&
            this.topologyData.gData[id].children.length;
        // return this.gData[id].hasOwnProperty("children") && this.gData[id].children.length;
    },

};

export default dataSet;
