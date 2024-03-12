import $apirefresh from "../interceptor";

export default class RefreshService {
  static async logout() {
    return $apirefresh.post('/logout')
  }
}
