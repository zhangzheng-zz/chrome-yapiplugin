interface ApiData {
  // 描述
  title?: string;
  // 备注
  desc: string;
  // 备注
  markdown: string;
  // 方法
  method: string;
  // 地址
  path: string;
  // 请求参数
  req_query: ReqQuery[];
  // 请求 body json
  req_body_other?: string;
  // 响应结果 json
  res_body: string;
}

type ReqQuery = {
  desc?: string;
  example?: string;
  mutiple?: string;
  name?: string;
  required?: string;
  _id?: string;
};

type Options = {
  requestInstanceName: string;
  baseUrl: string;
  funcName: string;
};
(function () {
  let currentApiId = "";
  let currentApiData: ApiData;

  const initActionBtn = () => {
    const div = document.createElement("div");
    div.className = "btn-wrapper";
    div.innerHTML = `
      <button class='btn'>Copy query</button>
      <button class='btn'>Copy req body</button>
      <button class='btn'>Copy res body</button>
      <button class='btn'>Copy template function</button>
      <button id="config-btn" class='btn'>Hide Config</button>
    `;
    document.body.appendChild(div);

    const configWrapper = document.createElement("div");
    configWrapper.className = "config-wrapper";
    configWrapper.innerHTML = `
      <span class="config-input">
        <span class="config-text">baseUrl:</span>
        <input class="input" type="text" id="baseUrl" name="baseUrl">
      </span>
      <span class="config-input">
        <span class="config-text">functionName:</span>
        <input class="input" type="text" id="functionName" name="functionName">
      </span>
      <span class="config-input">
        <span class="config-text">requestInstanceName:</span>
        <input class="input" type="text" id="requestInstanceName" name="requestInstanceName">
      </span>
      `;
    document.body.appendChild(configWrapper);

    history.pushState = bindEventListener("pushState");
    history.replaceState = bindEventListener("replaceState");

    window.addEventListener("replaceState", onUrlChange);
    window.addEventListener("pushState", onUrlChange);
    window.addEventListener("popstate", onUrlChange);

    function onUrlChange() {
      const url = location.href;
      div.style.display = /\/project\/\d+\/interface\/api\/\d+/.test(url)
        ? "flex"
        : "none";
      configWrapper.style.display = /\/project\/\d+\/interface\/api\/\d+/.test(
        url
      )
        ? "flex"
        : "none";
      currentApiId = "";
      // @ts-ignore
      currentApiData = null;
    }
    onUrlChange();


    function genConfigDom() {
      const btnText = document.getElementById('config-btn')?.innerHTML;
      if (btnText && btnText === 'Show Config') {
        configWrapper.style.display = 'flex';
        (document.getElementById('config-btn') as HTMLElement).innerHTML = 'Hide Config'
      } else {
        configWrapper.style.display = 'none';
        (document.getElementById('config-btn') as HTMLElement).innerHTML = 'Show Config'
      }
    }

    div.addEventListener("click", async (e) => {
      try {
        let apiId = "";
        let apiData: ApiData;
        const match = /\/project\/\d+\/interface\/api\/(\d+)/.exec(
          location.href
        );
        if (match) {
          apiId = match[1];
        }
        if (apiId && apiId === currentApiId && currentApiData) {
          apiData = currentApiData;
        } else {
          apiData = await fetch(
            `${location.protocol}//${location.host}/api/interface/get?id=${apiId}`
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.errcode === 0) {
                return res.data;
              } else {
                return Promise.reject("data error");
              }
            });
          currentApiId = apiId;
          currentApiData = apiData;
        }

        const index = [...(div.children as unknown as HTMLElement[])].findIndex(
          (it) => e.target === it
        );
        let ret = "";
        switch (index) {
          case 0:
            ret = genQueryType(apiData.req_query);
            break;
          case 1:
            ret = apiData.req_body_other
              ? genDataType(JSON.parse(apiData.req_body_other))
              : "{}";
            break;
          case 2:
            ret = genDataType(JSON.parse(apiData.res_body)?.properties?.data);
            break;
          case 3:
            ret = genTemplateFunction();
            break;
          case 4:
            genConfigDom();
          break;
          default:
            break;
        }
        await copyToClipboard(ret);
        // reset button text
        if (index !== 4) {
          const btnText = div.children[index].innerHTML;
          div.children[index].innerHTML = "Done!";
          setTimeout(() => {
            div.children[index].innerHTML = btnText;
          }, 1500);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  initActionBtn();

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log(err);
      const inp = document.createElement("input");
      inp.type = "text";
      inp.value = text;
      document.body.appendChild(inp);
      inp.select();
      document.execCommand("Copy");
      document.body.removeChild(inp);
    }
  }

  function snakeCaseToCamelCase(key = "") {
    return key.replace(/_(\w)/g, (match, p1) => p1.toUpperCase());
  }

  function genQueryType(data: Array<any>) {
    if (!Array.isArray(data)) {
      return "";
    }
    if (data.length === 0) {
      return "{}";
    }
    const ret = [];
    ret.push(`{\n`);
    data.forEach(({ name, required }) => {
      ret.push(
        `  ${snakeCaseToCamelCase(name)}${
          required === "1" ? ":" : "?:"
        } string;\n`
      );
    });
    ret.push("}");
    return ret.join("");
  }

  function genDataType(data: { type: string }, tabCount = 0): string {
    if (!data) {
      return "{}";
    }
    if (["boolean", "string", "number"].includes(data.type)) {
      return data.type;
    }
    if (data.type === "integer") {
      return "number";
    }
    if (data.type === "object") {
      return genObjectType(data, tabCount);
    }
    if (data.type === "array") {
      return genArrayType(data, tabCount);
    }
    return "";
  }

  function genObjectType(
    data: { type?: string; properties?: any; required?: any },
    tabCount = 0
  ) {
    if (!data.properties) {
      return "{}";
    }
    const requiredFieldDict =
      data.required?.reduce(
        (acc: { [x: string]: boolean }, cur: string | number) => {
          acc[cur] = true;
          return acc;
        },
        {}
      ) ?? {};
    const ret = [];
    ret.push(`{\n`);
    Object.entries(data.properties).forEach(([key, value]) => {
      return ret.push(
        `${"  ".repeat(tabCount + 1)}${snakeCaseToCamelCase(key)}${
          requiredFieldDict[key] ? ":" : "?:"
        } ${genDataType(value as { type: string }, tabCount + 1)};\n`
      );
    });
    ret.push(`${"  ".repeat(tabCount)}}`);
    return ret.join("");
  }

  function genArrayType(
    data: { type?: string; items?: any },
    tabCount = 0
  ): string {
    const { items } = data;
    if (["string", "boolean", "number"].includes(items.type)) {
      return `${data.items.type}[]`;
    }
    if (items.type === "integer") {
      return "number[]";
    }
    const ret = [];
    ret.push(`Array<`);
    if (items.type === "object") {
      ret.push(genObjectType(items, tabCount));
    } else if (items.type === "array") {
      ret.push(genArrayType(items, tabCount));
    }
    ret.push(">");
    return ret.join("");
  }

  function genTemplateFunction() {
    let ret = "";
    const {
      method: c_method,
      title: c_title = '',
      path: c_path,
      req_query: c_req_query,
      req_body_other: c_req_body_other,
    } = currentApiData;

    // // 第一步： 配置
    const requestInstanceName =
      (document.getElementById("requestInstanceName") as HTMLInputElement).value || "request";
    const baseUrl =
      (document.getElementById("baseUrl") as HTMLInputElement).value || "";
    const funcName =
      (document.getElementById("functionName") as HTMLInputElement).value || "";
    const options: Options = {
      requestInstanceName,
      baseUrl,
      funcName,
    };

    // 第二步：方法名
    const functionName = funcName || camelCase(genFunctionName());

    // 第三步：请求方式和路径实例名称
    const method = c_method.toLowerCase();
    const path = options.baseUrl
      ? c_path.replace(options.baseUrl, "")
      : c_path;

    // 第四步：注释
    const comments = createComments(c_title || '');

    // 第五步：ts 类型
    const typescriptDeclaration = createTsDeclaration(options);
    const paramTypeName = getParamsTypesName(options);
    const responseTypeName = getResponseTypesName(options);

    let query = "";
    if (
      (c_req_query.length !== 0 && method === "get") ||
      (c_req_body_other && method !== "get")
    ) {
      query = `params: ${paramTypeName}`;
    }

    let paramsStr = "";
    if (!!query) {
      if (method === "get") {
        paramsStr = `, { params }`;
      } else {
        paramsStr = `, { ...params }`;
      }
    }

    // 第六步：生成模版代码
    ret += `
    ${typescriptDeclaration}
    ${comments}
export function ${functionName}(${query}): Promise<${responseTypeName}> {
  return ${options.requestInstanceName}.${method}('${path}'${paramsStr});
}`;
    return ret;
  }

  function getResponseTypesName(options: Options) {
    return `Response${
      options.funcName ? pascalCase(options.funcName) : pascalCase(genFunctionName())
    }`;
  }

  // 函数名由 api 地址的最后一个单词生成
  function genFunctionName() {
    const pathSplit = currentApiData.path.split("/");
    const name = pathSplit[pathSplit.length - 1] ?
      pathSplit[pathSplit.length - 1] :  
      pathSplit[pathSplit.length - 2]
    return name || "functionName";
  }

  function createTsDeclaration(options: Options) {
    const {
      method: c_method,
      req_query: c_req_query,
      req_body_other: c_req_body_other,
      res_body: c_res_body,
    } = currentApiData;

    let ret = "";

    // 响应体声明
    if (c_req_body_other && c_method.toLowerCase() !== "get") {
      const reqDataType = genDataType(JSON.parse(c_req_body_other));
      ret += `
export interface ${getParamsTypesName(options)} ${reqDataType}`;
    }

    // get 请求参数声明
    if (Array.isArray(c_req_query) && c_req_query.length !== 0 && c_method.toLowerCase() === "get") {
      const reqQueryType = genQueryType(currentApiData.req_query);
      ret += `
export interface ${getParamsTypesName(options)} ${reqQueryType}`;
    }

    if (JSON.parse(c_res_body)?.properties?.data) {
      const resDataType = genDataType(JSON.parse(c_res_body)?.properties?.data);
      const resTypeDes = pascalCase(genFunctionName());
      const resTypeName = `Response${options.funcName ? pascalCase(options.funcName) : resTypeDes}`;
      // 处理返回为数组类型
      const content = resDataType.match(/^Array<([\s\S]*)>$/);
      if (content && content[1]) {
        ret += `
export type ${resTypeDes} = ${content[1]}
export type ${resTypeName} = Array<${resTypeDes}>`;
      } else {
        ret += `
export interface ${resTypeName} ${resDataType}`;
      }
    }
    return ret;
  }

  function getParamsTypesName(options: Options) {
    return `Params${
      options.funcName ? pascalCase(options.funcName) : pascalCase(genFunctionName())
    }`;
  }
  
})();

function createComments(title: string) {
  let str = `
/**
 * ${title}
 */`;
  return str;
}

function titleCase(input: string | any[]) {
  return input[0].toLocaleUpperCase() + input.slice(1);
}

function pascalCase(value: string | null | undefined) {
  if (value === null || value === undefined) return "";
  if (typeof value.toString !== "function") return "";

  const input = value.toString().trim();
  if (input === "") return "";
  if (input.length === 1) return input.toLocaleUpperCase();

  const match = input.match(/[a-zA-Z0-9]+/g);
  if (match) {
    return match.map((m) => titleCase(m)).join("");
  }

  return input;
}

function camelCase(value: string | null | undefined) {
  const result = pascalCase(value);
  return result ? `${result[0].toLocaleLowerCase()}${result.slice(1)}` : "";
}

// 劫持路由事件 派发到 window 
function bindEventListener (type: "pushState" | "replaceState") {
  const historyEvent = history[type];
  return function () {
    //@ts-ignore
    const newEvent = historyEvent.apply(this, arguments);
    const e = new Event(type);
    //@ts-ignore
    e.arguments = arguments;
    window.dispatchEvent(e);
    return newEvent;
  };
};
