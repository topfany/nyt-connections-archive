import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  try {
    const response = await fetch(
      `https://www.nytimes.com/svc/connections/v1/${date}.json`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept': 'application/json, text/plain, */*'
        }
      }
    );

    return NextResponse.json(response);

    // 检查响应状态
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.text(); // 尝试获取错误信息
      } catch (e) {
        errorData = 'Unable to parse error response';
      }
      
      throw new Error(
        `API request failed with status ${response.status}: ${errorData}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        message: error instanceof Error ? error.message : 'Unknown error',
        date: date,
        details: {
          url: `https://www.nytimes.com/svc/connections/v1/${date}.json`,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}