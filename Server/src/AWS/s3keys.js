let aws_keys = {
    S3: {
        region: 'us-east-1' ,
        accessKeyId:'AKIAQYIYQQLB2GMWWQHZ',
        secretAccessKey: "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"
    },
    rekogniton: {
        region: 'us-east-1' ,
        accessKeyId:'AKIAQYIYQQLBTEG7LZZM',
        secretAccessKey: "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"
    },
    cognito:{
        UserPoolId: 'us-east-2_ISCxSz9ah',
        ClientId: '6vh7k5to09codjc0l05npbd7rl'
    },
    translate:{
        region: 'us-east-1' ,
        accessKeyId:'AKIAQYIYQQLBTEG7LZZM',
        secretAccessKey: "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"
    }
}
module.exports = aws_keys;
