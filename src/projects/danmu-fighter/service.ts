import axios from 'axios';

interface BiliBiliDanmuInfo {
    host_list: Record<string, unknown>[];
    token: string;
}

export const getBiliBiliDanmuInfo = async (
    roomId: number
): Promise<BiliBiliDanmuInfo> => {
    const {
        data: { data },
    } = await axios.get(
        `http://bilibilidanmuproxy.streakingman.com/?roomId=${roomId}`
    );
    return data;
};
