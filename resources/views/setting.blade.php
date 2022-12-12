<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    @vite(['resources/scss/app.scss', 'resources/js/app.js'])
</head>

<body>
    <div class="container p-4">
        <h1 class="text-center">
            <img src="{{ url('static/logo.png') }}" class="img-fluid" style="width: 2.5em" />
            修改個人資料
        </h1>
        <form>
            <div class="mb-3">
                <label for="birthdayInput" class="form-label">生日</label>
                <input type="date" class="form-control" id="birthdayInput">
            </div>
            <div class="mb-3">
                <label for="birthdayOption" class="form-label">生理性別</label>
                <select class="form-select" id="birthdayOption">
                    <option selected disabled>性別</option>
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="other">其他</option>
                </select>
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="familyHistory">
                <label class="form-check-label" for="familyHistory">家族是否有癌症病史</label>
            </div>

            <h6>您比較想預防的癌症是？</h6>
            <div class="mb-3">
                <div class="row">
                    @foreach( $CANCERS as $cancer )
                    <div class="col-12 md-col-6">
                        <input type="checkbox" class="form-check-input" id="cancer{{ $cancer }}">
                        <label class="form-check-label" for="cancer{{ $cancer }}">{{ $cancer }} </label>
                    </div>
                    @endforeach
                </div>
            </div>
            <button type="submit" class="btn btn-primary">儲存</button>
        </form>
    </div>
</body>

</html>