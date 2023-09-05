import { sdkSotre } from "./store";
import { v4 as uuidv4 } from "uuid";

export const setSnippets = (data: { code: string; language: string; description: string }) => {
  return new Promise((resolve, reject) => {
    try {
      const { sdk } = sdkSotre.getState();

      if (!sdk) {
        reject({ msg: "please login" });
      } else {
        sdk
          .setSnippets(
            {
              ...data,
              createTimestamp: new Date().getTime(),
              updateTimestamp: new Date().getTime(),
              id: uuidv4()
            },
            0
          )
          .then((data) => {
            resolve({ msg: "success" });
          })
          .catch((e) => {
            reject({ msg: e });
          });
      }
    } catch (e) {
      reject({ msg: "error" });
    }
  });
};
