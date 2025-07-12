const mockAxios = {
    post: jest.fn().mockResolvedValue( { data: {} } ),
    get: jest.fn().mockResolvedValue( { data: {} } ),
};

export default mockAxios;
export const AxiosError = Error;