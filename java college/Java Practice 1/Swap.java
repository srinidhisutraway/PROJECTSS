import java.util.Arrays;
public class Swap {
    public static void main(String[] args) {
        int[] arr={1,2,3,4};
        Swapp(arr);
        System.out.println(Arrays.toString(arr));

    }
    static void Swapp(int[] arr){
        for(int i=0;i<arr.length;i++){
            for(int j=0;j<=i;j++){
        int temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
            }
    }
    }
    
}
